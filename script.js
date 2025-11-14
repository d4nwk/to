// Build filter tabs dynamically from the project cards
document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".project-card"));
  const tabsContainer = document.querySelector("[data-filter-tabs]");
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (!cards.length || !tabsContainer) return;

  const categories = ["All", ...new Set(cards.map((c) => c.dataset.category))];

  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.className =
      "filter-tab" + (index === 0 ? " filter-tab--active" : "");
    button.textContent = category;
    button.dataset.filter = category;

    button.addEventListener("click", () => {
      // Active state
      document.querySelectorAll(".filter-tab").forEach((btn) => {
        btn.classList.toggle("filter-tab--active", btn === button);
      });

      // Show/hide cards
      cards.forEach((card) => {
        const match =
          category === "All" || card.dataset.category === category;
        card.style.display = match ? "" : "none";
      });
    });

    tabsContainer.appendChild(button);
  });
});
