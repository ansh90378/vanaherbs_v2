/**
 * form.js — Contact form validation & submission
 */

const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (form && submitBtn) {

  /**
   * Basic field validation.
   * Returns an error message string, or null if valid.
   *
   * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field
   * @returns {string|null}
   */
  function validateField(field) {
    const value = field.value.trim();

    if (field.required && !value) {
      return 'This field is required.';
    }

    if (field.type === 'email' && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return 'Please enter a valid email address.';
      }
    }

    return null;
  }

  /**
   * Show or clear an error message below a field.
   *
   * @param {HTMLElement} field
   * @param {string|null} message
   */
  function setFieldError(field, message) {
    // Remove any existing error
    const existing = field.parentElement.querySelector('.form__error');
    if (existing) existing.remove();

    if (message) {
      const error = document.createElement('p');
      error.className = 'form__error';
      error.textContent = message;
      error.style.cssText = 'font-size:0.75rem;color:#c8a96e;margin-top:4px;';
      field.parentElement.appendChild(error);
      field.style.borderColor = 'rgba(200,169,110,0.6)';
    } else {
      field.style.borderColor = '';
    }
  }

  /**
   * Validate all required fields and return whether the form is valid.
   * @returns {boolean}
   */
  function validateForm() {
    let isValid = true;
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach((field) => {
      const error = validateField(field);
      setFieldError(field, error);
      if (error) isValid = false;
    });

    return isValid;
  }

  // Live validation on blur
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => {
      const error = validateField(field);
      setFieldError(field, error);
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Simulate async submission
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      submitBtn.textContent         = '✓ Enquiry sent — we\'ll be in touch within 24h';
      submitBtn.style.backgroundColor = '#3B6D11';
      submitBtn.style.color           = '#C0DD97';

      // Optional: reset form after delay
      setTimeout(() => {
        form.reset();
        submitBtn.textContent         = 'Send Enquiry →';
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color           = '';
        submitBtn.disabled              = false;
      }, 5000);
    }, 1200);
  });
}
