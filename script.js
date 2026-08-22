
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
  const htmlElement = document.documentElement;
 
  // Apply saved preference as soon as the script runs
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    htmlElement.classList.add('dark');
  }
 
  function toggleTheme() {
    htmlElement.classList.toggle('dark');
    const isDark = htmlElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
 
  // Both the desktop nav button and the mobile menu button control the same theme
  const toggleButtons = [
    document.getElementById('dark-mode-toggle'),
    document.getElementById('dark-mode-toggle-mobile')
  ].filter(Boolean);
 
  toggleButtons.forEach(function (button) {
    button.addEventListener('click', toggleTheme);
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

      // Close all other open answers
      document.querySelectorAll('.faq-btn').forEach(function (otherButton) {
        const otherAnswer = otherButton.nextElementSibling;
        const otherIcon = otherButton.querySelector('.faq-icon');
        if (otherAnswer && otherButton !== faqButton) {
          otherAnswer.classList.add('hidden');
          otherButton.setAttribute('aria-expanded', 'false');

          if (otherIcon) {
            otherIcon.textContent = '+';
          }
        }
      });

      answer.classList.toggle('hidden', isOpen);
      faqButton.setAttribute('aria-expanded', String(!isOpen));

      // Change + to - when open
      const icon = faqButton.querySelector('.faq-icon');

      if (icon) {
        icon.textContent = isOpen ? '+' : '-';
      }
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
    const trimmed = nameInput.value.trim();
    const isValid = trimmed.length > 0;
    setFieldState(nameInput, isValid, 'Name is required.');
    return isValid;
  }

  function validateEmail() {
    const trimmed = emailInput.value.trim();
  
    if (trimmed === '') {
      setFieldState(emailInput, false, 'Email is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(trimmed);
    setFieldState(emailInput, isValid, 'Please enter a valid email address.');
    return isValid;
  }

  if (nameInput) {
    nameInput.addEventListener('input', validateName);
    nameInput.addEventListener('blur', validateName);
  }
  if (emailInput) {
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
  }
  // Prevent submission if fields are invalid
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const nameValid = nameInput ? validateName() : true;
      const emailValid = emailInput ? validateEmail() : true;
      if (!nameValid || !emailValid) {
        e.preventDefault();
        // Focus the first invalid field
        if (!nameValid && nameInput) nameInput.focus();
        else if (!emailValid && emailInput) emailInput.focus();
      } else {
        alert('Form submitted successfully!');
      }
    });
  }
})();