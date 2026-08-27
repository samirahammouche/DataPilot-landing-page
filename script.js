// ============================================
// 1. MOBILE NAVIGATION
// ============================================
(function () {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuButton || !mobileMenu) return;

  function toggleMenu(forceClose) {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    const shouldOpen = forceClose ? false : !isExpanded;

    menuButton.setAttribute('aria-expanded', String(shouldOpen));
    mobileMenu.classList.toggle('hidden', !shouldOpen);
  }

  menuButton.addEventListener('click', () => toggleMenu());

  // Close on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 640) toggleMenu(true);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      toggleMenu(true);
      menuButton.focus();
    }
  });

  // Close when clicking outside the menu
  document.addEventListener('click', function (e) {
    if (
      !mobileMenu.classList.contains('hidden') &&
      !mobileMenu.contains(e.target) &&
      !menuButton.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });
})();

// ============================================
// 2. LIGHT / DARK MODE
// ============================================
(function () {
  const html = document.documentElement;
  const STORAGE_KEY = 'theme';

  function applyTheme(theme) {
    html.classList.toggle('dark', theme === 'dark');
  }

  // Check saved preference first, then system preference, default to light
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  ['dark-mode-toggle', 'dark-mode-toggle-mobile'].forEach(function (id) {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', toggleTheme);
  });
})();

// ============================================
// 3. FAQ ACCORDION
// ============================================
(function () {
  const buttons = document.querySelectorAll('.faq-btn');
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isOpen = !answer.classList.contains('hidden');

      // Close ALL answers first (accordion behavior)
      buttons.forEach(function (otherBtn) {
        const otherAnswer = otherBtn.nextElementSibling;
        const otherIcon = otherBtn.querySelector('.faq-icon');
        if (otherAnswer) otherAnswer.classList.add('hidden');
        otherBtn.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.textContent = '+';
      });

      // Toggle current: if it was closed, open it; if open, keep closed
      if (!isOpen) {
        answer.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = '-';
      }
    });
  });
})();

// ============================================
// 4. FORM VALIDATION
// ============================================
(function () {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const successMsg = document.getElementById('form-success');

  if (!form || (!nameInput && !emailInput)) return;

  const VALID = ['border-green-500'];
  const INVALID = ['border-red-500'];

  function setState(input, isValid, msg) {
    const err = document.getElementById(input.id + '-error');
    input.classList.remove(...VALID, ...INVALID);
    input.classList.add(...(isValid ? VALID : INVALID));
    if (err) {
      err.textContent = isValid ? '' : msg;
      err.classList.toggle('hidden', isValid);
    }
  }

  function validateName() {
    const ok = nameInput.value.trim().length > 0;
    setState(nameInput, ok, 'Name is required.');
    return ok;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      setState(emailInput, false, 'Email is required.');
      return false;
    }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setState(emailInput, ok, 'Please enter a valid email address.');
    return ok;
  }

  // Debounce input validation for performance
  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  if (nameInput) {
    nameInput.addEventListener('input', debounce(validateName, 300));
    nameInput.addEventListener('blur', validateName);
  }
  if (emailInput) {
    emailInput.addEventListener('input', debounce(validateEmail, 300));
    emailInput.addEventListener('blur', validateEmail);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Always prevent — no backend

    const nameOk = nameInput ? validateName() : true;
    const emailOk = emailInput ? validateEmail() : true;

    if (!nameOk || !emailOk) {
      if (successMsg) successMsg.classList.add('hidden');
      (!nameOk ? nameInput : emailInput)?.focus();
      return;
    }

    // Success
    form.reset();
    [nameInput, emailInput].forEach(function (input) {
      if (input) input.classList.remove(...VALID, ...INVALID);
    });
    if (successMsg) successMsg.classList.remove('hidden');
  });
})();