/**
 * Vercel Speed Insights Initialization
 * This script initializes Vercel Speed Insights for the application.
 * When deployed on Vercel, Speed Insights will automatically track Web Vitals.
 */

(function() {
  // Initialize the Speed Insights queue
  window.si = window.si || function() {
    (window.siq = window.siq || []).push(arguments);
  };

  // Create and inject the Speed Insights script
  // When deployed on Vercel, this will load from /_vercel/speed-insights/script.js
  // In development, it will use the debug version from Vercel's CDN
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  const script = document.createElement('script');
  script.defer = true;
  
  if (isDevelopment) {
    // Development mode - use debug script from Vercel CDN
    script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.debug.js';
  } else {
    // Production mode - use Vercel's injected script path
    script.src = '/_vercel/speed-insights/script.js';
  }
  
  script.onerror = function() {
    console.log('[Vercel Speed Insights] Failed to load script. Please check if deployed on Vercel.');
  };
  
  document.head.appendChild(script);
})();
