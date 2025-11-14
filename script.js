// Simple section switcher to mimic the Me / Portfolio / Apps behaviour
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('[data-section-id]');

  function setActive(sectionId) {
    sections.forEach((section) => {
      const isActive = section.dataset.sectionId === sectionId;
      section.classList.toggle('hidden', !isActive);
      // quick re-trigger of fade-in
      if (isActive) {
        section.classList.remove('animate-fade-in');
        // force reflow
        void section.offsetWidth;
        section.classList.add('animate-fade-in');
      }
    });

    navLinks.forEach((link) => {
      const pill = link.querySelector('.nav-pill');
      const label = link.querySelector('.nav-label');
      const isActive = link.dataset.section === sectionId;

      if (isActive) {
        pill.classList.add('bg-primary', 'text-primary-content', 'px-4');
        label.classList.add('font-semibold');
      } else {
        pill.classList.remove('bg-primary', 'text-primary-content', 'px-4');
        label.classList.remove('font-semibold');
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const sectionId = link.dataset.section;
      setActive(sectionId);
    });
  });

  // default to "me"
  setActive('me');
});
