document.addEventListener("DOMContentLoaded", () => {
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

  // NOTE: I don't have direct access to your dev.to images from here,
  // so these use placeholder URLs. Swap them out later with your real
  // screenshot URLs when you have them handy.
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
  const galleryCaption = document.getElementById("gallery-caption");
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
      wrapper.className =
        "rounded-xl overflow-hidden bg-base-100 border border-base-300";

      const imageEl = document.createElement("img");
      imageEl.src = img.src;
      imageEl.alt = img.alt || "";
      imageEl.className = "w-full h-auto block";

      wrapper.appendChild(imageEl);
      galleryContainer.appendChild(wrapper);
    });
  }

  function setActiveProject(projectId) {
    projectCards.forEach((card) => {
      const isActive = card.dataset.projectId === projectId;
      card.classList.toggle("ring-2", isActive);
      card.classList.toggle("ring-[var(--accent)]", isActive);
      card.classList.toggle("ring-offset-2", isActive);
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

    galleryCaption.textContent = activeTag
      ? `Filtered by tag: ${activeTag}`
      : "Hover over a project to see its screenshots.";
  }

  tagButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation(); // don't interfere with hover

      const tag = btn.dataset.tag;

      if (activeTag === tag) {
        activeTag = null;
      } else {
        activeTag = tag;
      }

      // Update visual state on all tag buttons
      tagButtons.forEach((b) => {
        b.classList.toggle("active-tag", b.dataset.tag === activeTag);
      });

      applyTagFilter();
    });
  });
});
