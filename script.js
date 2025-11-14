// Simple navigation controller
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      // Update active nav item
      navItems.forEach((nav) => nav.classList.remove('active'));
      item.classList.add('active');

      // Show corresponding section
      sections.forEach((section) => {
        section.classList.remove('active');
      });
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });
});
