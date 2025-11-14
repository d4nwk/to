let isAuthorised = false;

// Simple password gate
(function passwordGate() {
  const PASSWORD = "904672";
  const maxAttempts = 3;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const input = prompt(
      "This page is currently password-protected.\n\nEnter the password to continue:"
    );

    if (input === null) {
      break;
    }

    if (input === PASSWORD) {
      isAuthorised = true;
      break;
    } else {
      alert("Incorrect password. Please try again.");
      attempts += 1;
    }
  }

  if (!isAuthorised) {
    document.body.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui,sans-serif;text-align:center;padding:1rem;background-color:#f5f5f5;"><div><h1 style="font-size:1.25rem;font-weight:600;margin-bottom:0.5rem;">Access denied</h1><p style="font-size:0.9rem;color:#555;">Incorrect or no password entered. Reload the page to try again.</p></div></div>';
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  if (!isAuthorised) return;

  /* ---------- NAV / SECTIONS ---------- */

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("[data-section-id]");

  function setActiveSection(sectionId) {
    sections.forEach((section) => {
      const isActive = section.dataset.sectionId === sectionId;
      section.classList.toggle("hidden", !isActive);

      if (isActive) {
        section.classList.remove("animate-fade-in");
        void section.offsetWidth; // reflow
        section.classList.add("animate-fade-in");
      }
    });

    navLinks.forEach((link) => {
      const pill = link.querySelector(".nav-pill");
      const label = link.querySelector(".nav-label");
      const isActive = link.dataset.section === sectionId;

      pill.classList.toggle("active-pill", isActive);
      label.classList.toggle("active-label", isActive);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const sectionId = link.dataset.section;
      setActiveSection(sectionId);
    });
  });

  // default
  setActiveSection("me");

  /* ---------- PORTFOLIO GALLERY DATA ---------- */

  const galleryData = {
    "he-dashboards": [
      {
        src: "https://placehold.co/1200x675?text=HE+Dashboards+1",
        alt: "Power BI HE dashboards - overview",
      },
      {
        src: "https://placehold.co/1200x675?text=HE+Dashboards+2",
        alt: "Power BI HE dashboards - utilisation view",
      },
      {
        src: "https://placehold.co/1200x675?text=HE+Dashboards+3",
        alt: "Power BI HE dashboards - suitability view",
      },
    ],
    "utilisation-dashboard": [
      {
        src: "https://placehold.co/1200x675?text=Timetable+Utilisation+1",
        alt: "Timetable utilisation report - heatmap",
      },
      {
        src: "https://placehold.co/1200x675?text=Timetable+Utilisation+2",
        alt: "Timetable utilisation report - building view",
      },
    ],
    "survey-etl": [
      {
        src: "https://placehold.co/1200x675?text=Survey+ETL+1",
        alt: "Survey ETL pipeline - data flow",
      },
      {
        src: "https://placehold.co/1200x675?text=Survey+ETL+2",
        alt: "Survey ETL pipeline - transformed table",
      },
    ],
    "room-matching": [
      {
        src: "https://placehold.co/1200x675?text=Room+Matching+1",
        alt: "Room matching tool - mapping UI",
      },
      {
        src: "https://placehold.co/1200x675?text=Room+Matching+2",
        alt: "Room matching tool - match diagnostics",
      },
    ],
  };

  const galleryContainer = document.getElementById("project-gallery");
  const projectCards = document.querySelectorAll("#project-list .card");

  function renderGallery(projectId) {
    galleryContainer.innerHTML = "";
    const imgs = galleryData[projectId];

    if (!imgs || imgs.length === 0) {
      galleryContainer.innerHTML =
        '<p class="text-xs text-base-content/60">No screenshots yet for this project.</p>';
      return;
    }

    imgs.forEach((img) => {
      const wrapper = document.createElement("div");
      wrapper.className = "relative";

      const imageEl = document.createElement("img");
      imageEl.src = img.src;
      imageEl.alt = img.alt || "";
      imageEl.className = "w-full h-auto block rounded-lg";

      const caption = document.createElement("p");
      caption.className =
        "absolute bottom-2 left-2 text-[0.7rem] text-white px-2 py-1 rounded-full";
      caption.style.backgroundColor = "#008080";
      caption.textContent = img.alt || "";

      wrapper.appendChild(imageEl);
      wrapper.appendChild(caption);
      galleryContainer.appendChild(wrapper);
    });
  }

  function setActiveProject(projectId) {
    projectCards.forEach((card) => {
      const isActive = card.dataset.projectId === projectId;

      if (isActive) {
        card.style.backgroundColor = "var(--project-card-active)";
      } else {
        card.style.backgroundColor = "var(--project-card-inactive)";
      }
    });

    renderGallery(projectId);
  }

  // Hover behaviour – update gallery
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const id = card.dataset.projectId;
      setActiveProject(id);
    });
  });

  // Make gallery show first project initially
  const firstCard = projectCards[0];
  if (firstCard) {
    setActiveProject(firstCard.dataset.projectId);
  }

  /* ---------- TAG FILTERING ---------- */

  let activeTag = null;

  const tagButtons = document.querySelectorAll(".tag-badge");

  function applyTagFilter() {
    projectCards.forEach((card) => {
      const tags = (card.dataset.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const match = !activeTag || tags.includes(activeTag);
      card.classList.toggle("hidden", !match);
    });

    // After filtering, ensure gallery shows a visible project
    const firstVisible = Array.from(projectCards).find(
      (c) => !c.classList.contains("hidden")
    );
    if (firstVisible) {
      setActiveProject(firstVisible.dataset.projectId);
    } else {
      galleryContainer.innerHTML =
        '<p class="text-xs text-base-content/60">No projects match this tag yet.</p>';
    }
  }

  tagButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation(); // don't interfere with hover

      const tag = btn.dataset.tag;

      if (activeTag === tag) {
        activeTag = null;
      } else {
        activeTag =
