
// Mobile Navigation 
(function () {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuButton || !mobileMenu) return;

  menuButton.addEventListener('click', function () {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.classList.toggle('hidden');
  });

  // Close the mobile menu automatically if the window is resized past the mobile breakpoint
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 640) {
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
})();

//Light / Dark Mode 
(function () {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const htmlElement = document.documentElement;

  // Apply saved preference as soon as the script runs
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    htmlElement.classList.add('dark');
  }

  if (!darkModeToggle) return;

  darkModeToggle.addEventListener('click', function () {
    htmlElement.classList.toggle('dark');
    const isDark = htmlElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
})();

// FAQ Accordion
(function () {
  const faqButtons = document.querySelectorAll('.faq-btn');
  if (!faqButtons.length) return;

  faqButtons.forEach(function (faqButton) {
    faqButton.addEventListener('click', function () {
      const answer = faqButton.nextElementSibling;
      if (!answer) return;

      const isOpen = !answer.classList.contains('hidden');

      // Close all other open answers (optional "one open at a time" behavior)
      document.querySelectorAll('.faq-btn').forEach(function (otherButton) {
        const otherAnswer = otherButton.nextElementSibling;
        if (otherAnswer && otherButton !== faqButton) {
          otherAnswer.classList.add('hidden');
          otherButton.setAttribute('aria-expanded', 'false');
        }
      });

      answer.classList.toggle('hidden', isOpen);
      faqButton.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();

// Real-Time Form Validation 
(function () {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  if (!nameInput && !emailInput) return;

  const VALID_CLASSES = ['border-green-500'];
  const INVALID_CLASSES = ['border-red-500'];

  function setFieldState(input, isValid, errorMessage) {
    const errorEl = document.getElementById(input.id + '-error');

    input.classList.remove(...VALID_CLASSES, ...INVALID_CLASSES);
    input.classList.add(...(isValid ? VALID_CLASSES : INVALID_CLASSES));

    if (errorEl) {
      errorEl.textContent = isValid ? '' : errorMessage;
      errorEl.classList.toggle('hidden', isValid);
    }
  }

  function validateName() {
    const isValid = nameInput.value.trim().length > 0;
    setFieldState(nameInput, isValid, 'Name is required.');
    return isValid;
  }

  function validateEmail() {
    const isValid = emailInput.value.includes('@') && emailInput.value.trim().length > 3;
    setFieldState(emailInput, isValid, 'Please enter a valid email address.');
    return isValid;
  }

  if (nameInput) {
    nameInput.addEventListener('input', validateName);
  }
  if (emailInput) {
    emailInput.addEventListener('input', validateEmail);
  }

  // Prevent submission if fields are invalid
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const nameValid = nameInput ? validateName() : true;
      const emailValid = emailInput ? validateEmail() : true;
      if (!nameValid || !emailValid) {
        e.preventDefault();
      }
    });
  }
})();