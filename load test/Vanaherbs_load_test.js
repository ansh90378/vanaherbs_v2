import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ─────────────────────────────────────────────────────────
// CONFIG — matches js/config.js and the current root app.
// ─────────────────────────────────────────────────────────
const BACKEND_URL = 'https://login-server-eqsv.onrender.com';
const SITE_URL = 'https://vanaherbs-v2.vercel.app';
const ENQUIRY_URL = `${SITE_URL}/api/enquiry`;
const EMAIL_RATE = Number(__ENV.EMAIL_RATE || 0.3);

const errorRate = new Rate('errors');
const signupDuration = new Trend('signup_duration');
const loginDuration = new Trend('login_duration');
const productsDuration = new Trend('products_duration');
const enquiryDuration = new Trend('enquiry_duration');

function chooseRandomProducts(products) {
  const shuffled = products.slice();
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  const count = Math.min(2 + Math.floor(Math.random() * 3), shuffled.length);
  return shuffled.slice(0, count).map((product) => product.name);
}

// ─────────────────────────────────────────────────────────
// LOAD PROFILE
// Email traffic is capped to avoid flooding the configured inbox.
// ─────────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m',  target: 10 },
    { duration: '30s', target: 30 },
    { duration: '1m',  target: 30 },
    { duration: '30s', target: 60 },
    { duration: '1m',  target: 60 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // Render cold starts can exceed 2s during the first request.
    http_req_duration: ['p(95)<3000'],
    errors: ['rate<0.05'],
  },
};

export default function () {
  const uid = `${__VU}_${__ITER}_${Date.now()}`;
  const dummyEmail = `loadtest_${uid}@vanaherbs-loadtest.com`;
  const dummyPassword = 'LoadTest123!';
  let authToken = null;
  let refreshToken = null;
  let products = [];

  group('Create Account', function () {
    const payload = JSON.stringify({
      email: dummyEmail,
      password: dummyPassword,
      display_name: `Load Test ${uid}`,
    });
    const res = http.post(`${BACKEND_URL}/api/v1/register`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    signupDuration.add(res.timings.duration);
    const ok = check(res, {
      'Create Account succeeded (201)': (r) => r.status === 201,
    });
    errorRate.add(!ok);
  });

  sleep(1);

  group('Sign In', function () {
    const payload = JSON.stringify({
      email: dummyEmail,
      password: dummyPassword,
    });
    const res = http.post(`${BACKEND_URL}/api/v1/login`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    loginDuration.add(res.timings.duration);
    const ok = check(res, {
      'Sign In succeeded': (r) => r.status === 200,
      'Sign In returned tokens': (r) => {
        try {
          const data = JSON.parse(r.body);
          return !!data.access_token && !!data.refresh_token;
        } catch {
          return false;
        }
      },
    });
    errorRate.add(!ok);
    if (ok) {
      try {
        const data = JSON.parse(res.body);
        authToken = data.access_token;
        refreshToken = data.refresh_token;
      } catch {
        authToken = null;
        refreshToken = null;
      }
    }
  });

  sleep(1);

  group('Explore Products', function () {
    const res = http.get(`${SITE_URL}/data/products.json`);
    productsDuration.add(res.timings.duration);
    const ok = check(res, {
      'products loaded': (r) => r.status === 200,
      'products response is JSON': (r) => (r.headers['Content-Type'] || '').includes('application/json'),
    });
    errorRate.add(!ok);
    if (ok) {
      try {
        products = JSON.parse(res.body);
      } catch {
        products = [];
      }
    }
  });

  sleep(Math.random() * 2 + 1);

  group('Enquiry / email test', function () {
    // Only ~30% of iterations submit an enquiry by default. Use EMAIL_RATE=1
    // for a small run that explicitly verifies email delivery.
    if (Math.random() > EMAIL_RATE) return;

    const selectedProducts = chooseRandomProducts(products);
    if (selectedProducts.length === 0) return;

    const payload = JSON.stringify({
      name: `Load Test ${uid}`,
      email: dummyEmail,
      company: 'Load Test Co',
      phone: '+919999999999',
      product: selectedProducts,
      message: `Automated load test enquiry ${uid} - please ignore/delete.`,
      user_email: dummyEmail,
    });
    const res = http.post(ENQUIRY_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    enquiryDuration.add(res.timings.duration);
    const ok = check(res, {
      'Send Enquiry succeeded (200)': (r) => r.status === 200,
      'enquiry responded under 2.5s': (r) => r.timings.duration < 2500,
    });
    errorRate.add(!ok);
  });

  sleep(1);

  group('Logout', function () {
    if (refreshToken) {
      const payload = JSON.stringify({ refresh_token: refreshToken });
      const res = http.post(`${BACKEND_URL}/api/v1/logout`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      const ok = check(res, {
        'logout succeeded': (r) => r.status === 200 || r.status === 204,
      });
      errorRate.add(!ok);
    }
  });

  sleep(1);
}