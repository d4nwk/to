import React, { useEffect, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const TABS = ["WORK", "ABOUT", "CONTACT", "CV"];

const CONTACT_EMAIL = "danwk@naver.com";
const CONTACT_SUBJECT = "Portfolio inquiry";
const CV_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const workItems = [
  {
    title: "Custom dashboard platform with drag-and-drop analysis 'blocks'",
    description:
      "Designed a modular analytics workflow where users assemble reusable analysis blocks and build dashboards without writing code.",
    image: "./macbook.png",
    alt: "Project 01 mockup",
    layout: "half-left",
  },
  {
    title: "ML-powered news article vocab acquisition iOS app",
    description:
      "Shaped the product experience for a mobile learning app that extracts high-value vocabulary from live news content and personalizes review.",
    image: "./iphone.png",
    alt: "Project 02 mockup",
    layout: "half-right",
  },
  {
    title: "Data consultancy company website visual & structural overhaul",
    description:
      "Reworked information architecture and visual hierarchy to better communicate services, case studies, and trust signals for new clients.",
    image: "https://placehold.co/1200x760/171717/c7e0df?text=Project+03",
    alt: "Project 03 placeholder",
    layout: "full-left-media",
  },
  {
    title: "Placeholder 4",
    description:
      "Reserved for an additional case study card with project summary, outcomes, and links once final assets are ready.",
    image: "https://placehold.co/860x1140/171717/c7e0df?text=Project+04",
    alt: "Project 04 placeholder",
    layout: "full-right-media",
  },
];

const aboutItems = [
  {
    title: "How I work",
    description:
      "I blend product thinking with analytical rigor, turning ambiguity into clear flows, practical interfaces, and measurable outcomes.",
    image: "https://placehold.co/1000x700/c7e0df/171717?text=About+01",
    alt: "Placeholder image for About section 01",
  },
  {
    title: "What I focus on",
    description:
      "My practice emphasizes user understanding, information clarity, and iteration through evidence, not assumptions.",
    image: "https://placehold.co/1000x700/b8d7d6/171717?text=About+02",
    alt: "Placeholder image for About section 02",
  },
  {
    title: "What I am building toward",
    description:
      "I enjoy projects where systems, data, and product design intersect, especially where thoughtful UX can simplify complex decisions.",
    image: "https://placehold.co/1000x700/a9cecd/171717?text=About+03",
    alt: "Placeholder image for About section 03",
  },
];

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function RevealText({ children, className = "", as: Tag = "div", style }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={style}
      className={`text-reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

function WorkSection() {
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);
  const scrollRafRef = useRef(0);
  const swapRafRef = useRef(0);
  const swapStartedAtRef = useRef(0);
  const phaseRef = useRef("hero_idle");
  const swapProgressRef = useRef(0);
  const swappingRef = useRef(false);

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 941 : true
  );
  const [phase, setPhase] = useState("hero_idle");
  const [swapProgress, setSwapProgress] = useState(0);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    swapProgressRef.current = swapProgress;
  }, [swapProgress]);

  useEffect(() => {
    const SWAP_DURATION_MS = 220;

    const stopSwap = () => {
      if (swapRafRef.current) {
        window.cancelAnimationFrame(swapRafRef.current);
        swapRafRef.current = 0;
      }
      swappingRef.current = false;
    };

    const startSwap = () => {
      if (swappingRef.current || phaseRef.current !== "hero_idle") return;

      swappingRef.current = true;
      swapStartedAtRef.current = 0;
      setPhase("hero_to_card1_swap");
      setSwapProgress(0);

      const stepSwap = (timestamp) => {
        if (!swapStartedAtRef.current) swapStartedAtRef.current = timestamp;
        const elapsed = timestamp - swapStartedAtRef.current;
        const next = clamp01(elapsed / SWAP_DURATION_MS);
        setSwapProgress(next);

        if (next < 1) {
          swapRafRef.current = window.requestAnimationFrame(stepSwap);
          return;
        }

        swappingRef.current = false;
        swapRafRef.current = 0;
        setPhase("card1_scroll");
      };

      swapRafRef.current = window.requestAnimationFrame(stepSwap);
    };

    const updateState = () => {
      const nextDesktop = window.innerWidth >= 941;
      if (nextDesktop !== isDesktop) setIsDesktop(nextDesktop);

      if (!nextDesktop) {
        stopSwap();
        if (phaseRef.current !== "hero_idle") setPhase("hero_idle");
        if (swapProgressRef.current !== 0) setSwapProgress(0);
        return;
      }

      const stage1El = stage1Ref.current;
      const stage2El = stage2Ref.current;
      if (!stage1El || !stage2El) return;

      const viewportHeight = Math.max(1, window.innerHeight || 1);
      const navOffset = 86;
      const trigger = viewportHeight * 0.12;
      const reset = viewportHeight * 0.06;

      const stage1Top = stage1El.getBoundingClientRect().top + window.scrollY;
      const stage1Local = Math.max(0, window.scrollY - stage1Top);

      const stage2Rect = stage2El.getBoundingClientRect();
      const stage2Active =
        stage2Rect.top <= navOffset + 32 && stage2Rect.bottom >= navOffset + viewportHeight * 0.5;
      const stage2Passed = stage2Rect.bottom < navOffset + viewportHeight * 0.3;

      if (!swappingRef.current) {
        if (stage1Local <= reset) {
          if (phaseRef.current !== "hero_idle") setPhase("hero_idle");
          if (swapProgressRef.current !== 0) setSwapProgress(0);
          return;
        }

        if (phaseRef.current === "hero_idle" && stage1Local >= trigger) {
          startSwap();
          return;
        }

        if (phaseRef.current !== "hero_idle") {
          const nextPhase = stage2Passed
            ? "post_cluster"
            : stage2Active
              ? "card2_cluster"
              : "card1_scroll";
          if (phaseRef.current !== nextPhase) setPhase(nextPhase);
        }
      }
    };

    const onViewportMove = () => {
      if (scrollRafRef.current) return;
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = 0;
        updateState();
      });
    };

    updateState();
    window.addEventListener("scroll", onViewportMove, { passive: true });
    window.addEventListener("resize", onViewportMove);

    return () => {
      if (scrollRafRef.current) window.cancelAnimationFrame(scrollRafRef.current);
      stopSwap();
      window.removeEventListener("scroll", onViewportMove);
      window.removeEventListener("resize", onViewportMove);
    };
  }, [isDesktop]);

  const [item1, item2, item3, item4] = workItems;

  const heroOpacity =
    phase === "hero_to_card1_swap" ? 1 - swapProgress : phase === "hero_idle" ? 1 : 0;
  const card1Opacity =
    phase === "hero_to_card1_swap" ? swapProgress : phase === "hero_idle" ? 0 : 1;
  const showDesktopCluster = phase === "card2_cluster";

  return (
    <section className="section-shell section-work">
      <div className="work-desktop">
        <div ref={stage1Ref} className="work-phase work-phase-hero">
          <div className="work-phase-sticky">
            <img
              className="macbook-phase-mockup"
              src="./macbook.png"
              alt="Macbook data dashboard mockup"
              aria-hidden="true"
            />

            <div className="hero-swap-stack">
              <div className="hero-copy-layer" style={{ opacity: heroOpacity }}>
                <RevealText as="p" className="hero-bio">
                  Hi, I'm Dan, <br />
                  <span className="bio-accent">product designer</span> with a background in{" "}
                  <span className="bio-accent">data & mathematics</span>.
                </RevealText>
              </div>

              <article
                className="project-card info-card half-left pointer-right phase-card-one"
                style={{ opacity: card1Opacity, pointerEvents: card1Opacity > 0.98 ? "auto" : "none" }}
              >
                <div className="card-content">
                  <h2>{item1.title}</h2>
                  <p>{item1.description}</p>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div ref={stage2Ref} className="work-phase work-phase-cluster">
          <div className="work-phase-sticky">
            <div className={`iphone-cluster-fixed ${showDesktopCluster ? "is-visible" : ""}`.trim()}>
              <img className="iphone-back-left" src="./iphone.png" alt="" aria-hidden="true" />
              <img className="iphone-front-center" src="./iphone2.png" alt="" aria-hidden="true" />
              <img className="iphone-back-right" src="./iphone3.png" alt="" aria-hidden="true" />
            </div>

            <article className="project-card info-card half-right pointer-left phase-card-two">
              <div className="card-content">
                <h2>{item2.title}</h2>
                <p>{item2.description}</p>
              </div>
            </article>
          </div>
        </div>

        <div className="cluster-clearance" aria-hidden="true" />

        <div className="work-grid-post">
          <article className="project-card full-left-media">
            <div className="project-media-wrap">
              <img className="project-media" src={item3.image} alt={item3.alt} loading="lazy" />
            </div>
            <RevealText className="card-content">
              <h2>{item3.title}</h2>
              <p>{item3.description}</p>
            </RevealText>
          </article>

          <article className="project-card full-right-media">
            <div className="project-media-wrap">
              <img className="project-media" src={item4.image} alt={item4.alt} loading="lazy" />
            </div>
            <RevealText className="card-content">
              <h2>{item4.title}</h2>
              <p>{item4.description}</p>
            </RevealText>
          </article>
        </div>
      </div>

      <div className="work-mobile">
        <header className="work-mobile-hero">
          <RevealText as="p" className="hero-bio">
            Hi, I'm Dan,<br />
            <span className="bio-accent">product designer</span><br />
            with a background in<br />
            <span className="bio-accent">data & mathematics</span>.
          </RevealText>
        </header>

        <div className="mobile-macbook-wrap">
          <img src="./macbook.png" alt="Macbook data dashboard mockup" loading="lazy" />
        </div>

        <article className="project-card info-card pointer-top">
          <div className="card-content">
            <h2>{item1.title}</h2>
            <p>{item1.description}</p>
          </div>
        </article>

        <article className="project-card info-card pointer-bottom">
          <div className="card-content">
            <h2>{item2.title}</h2>
            <p>{item2.description}</p>
          </div>
        </article>

        <div className="iphone-cluster-mobile">
          <img className="iphone-back-left" src="./iphone.png" alt="" aria-hidden="true" />
          <img className="iphone-front-center" src="./iphone2.png" alt="" aria-hidden="true" />
          <img className="iphone-back-right" src="./iphone3.png" alt="" aria-hidden="true" />
        </div>

        <div className="work-grid-post">
          <article className="project-card full-left-media">
            <div className="project-media-wrap">
              <img className="project-media" src={item3.image} alt={item3.alt} loading="lazy" />
            </div>
            <RevealText className="card-content">
              <h2>{item3.title}</h2>
              <p>{item3.description}</p>
            </RevealText>
          </article>

          <article className="project-card full-right-media">
            <div className="project-media-wrap">
              <img className="project-media" src={item4.image} alt={item4.alt} loading="lazy" />
            </div>
            <RevealText className="card-content">
              <h2>{item4.title}</h2>
              <p>{item4.description}</p>
            </RevealText>
          </article>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section-shell">
      <div className="stack-list">
        {aboutItems.map((item, index) => (
          <article
            key={item.title}
            className={`split-card ${index % 2 === 1 ? "split-card-reverse" : ""}`}
          >
            <div className="card-media-wrap">
              <img className="card-media" src={item.image} alt={item.alt} loading="lazy" />
            </div>

            <RevealText className="card-content">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </RevealText>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      "",
      "Message:",
      formData.message,
    ].join("\n");

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      CONTACT_SUBJECT
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  };

  return (
    <section className="section-shell">
      <div className="contact-grid">
        <RevealText className="contact-copy">
          <h1>Let's work together</h1>
          <p>
            Have a project, collaboration, or product idea in mind? Send a note and I will get
            back to you.
          </p>
        </RevealText>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="hidden" name="subject" value={CONTACT_SUBJECT} />

          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleInput}
            required
          />

          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInput}
            required
          />

          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows="8"
            value={formData.message}
            onChange={handleInput}
            required
          />

          <button type="submit">Send email</button>
        </form>
      </div>
    </section>
  );
}

function CvSection() {
  return (
    <section className="section-shell">
      <div className="cv-header">
        <a className="download-btn" href={CV_PDF_URL} download>
          Download PDF
        </a>
      </div>

      <div className="cv-embed-shell">
        <object className="cv-embed" data={CV_PDF_URL} type="application/pdf">
          <p>
            PDF preview unavailable. <a href={CV_PDF_URL}>Open CV</a>
          </p>
        </object>
      </div>
    </section>
  );
}

function PortfolioApp() {
  const [activeTab, setActiveTab] = useState("WORK");
  const [navShadow, setNavShadow] = useState(false);

  useEffect(() => {
    const getThreshold = () => {
      const styles = getComputedStyle(document.documentElement);
      const desktopGap = parseFloat(styles.getPropertyValue("--work-gap")) || 56;
      const mobileGap = parseFloat(styles.getPropertyValue("--mobile-flow-gap")) || desktopGap;
      const base = window.matchMedia("(max-width: 940px)").matches ? mobileGap : desktopGap;
      return Math.max(0, base - 22);
    };

    const onViewportMove = () => {
      setNavShadow(window.scrollY >= getThreshold());
    };

    onViewportMove();
    window.addEventListener("scroll", onViewportMove, { passive: true });
    window.addEventListener("resize", onViewportMove);
    return () => {
      window.removeEventListener("scroll", onViewportMove);
      window.removeEventListener("resize", onViewportMove);
    };
  }, [activeTab]);

  return (
    <div className="portfolio-app">
      <style>{`
        :root {
          --color-bg: #c7e0df;
          --color-text: #171717;
          --color-link: #008080;
          --color-border: rgba(23, 23, 23, 0.2);
          --color-surface: rgba(255, 255, 255, 0.35);
          --radius-lg: 24px;
          --radius-md: 16px;
          --max-width: 1120px;
          --slide-distance: 22px;
          --nav-height: 72px;
          --work-gap: 56px;
          --card-pad: 22px;
          --card-outline: #4f5c61;
          --pointer-size: 14px;
          --pointer-protrusion: calc(var(--pointer-size) + 1px);
          --vertical-card-w: calc((100% - var(--work-gap)) / 2);
          --media-box-w: 500px;
          --work-media-h: 336px;
        }

        html {
          scrollbar-gutter: stable;
        }

        * {
          box-sizing: border-box;
        }

        .portfolio-app {
          min-height: 100%;
          background: var(--color-bg);
          color: var(--color-text);
          font-family: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
        }

        .site-shell {
          width: min(var(--max-width), calc(100% - 48px));
          margin: 0 auto;
          padding: 0 0 72px;
        }

        .site-nav {
          position: sticky;
          top: 0;
          z-index: 9999999999;
          isolation: isolate;
          overflow: visible;
          background: rgba(199, 224, 223, 0.94);
          backdrop-filter: blur(2px);
          box-shadow: none;
          transition: box-shadow 0.2s ease;
        }

        .site-nav.nav-shadow {
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.06);
        }

        .site-nav::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 100%;
          height: 10px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0));
          z-index: 2;
        }

        .site-nav.nav-shadow::after {
          opacity: 0.72;
        }

        .site-nav-inner {
          position: relative;
          z-index: 3;
          width: min(var(--max-width), calc(100% - 48px));
          margin: 0 auto;
          height: var(--nav-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .site-nav-brand {
          height: 40px;
          display: flex;
          align-items: center;
        }

        .site-nav-mark {
          width: 40px;
          height: 40px;
          display: block;
          filter: none;
          opacity: 0.98;
        }

        .site-nav-tabs {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .tab-btn {
          position: relative;
          appearance: none;
          border: none;
          background: transparent;
          padding: 6px 0;
          color: var(--color-link);
          font: inherit;
          font-size: 1rem;
          letter-spacing: 0.04em;
          cursor: pointer;
          opacity: 1;
          outline: none;
          box-shadow: none;
          transition: opacity 180ms ease;
        }

        .tab-btn::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background: var(--color-link);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 280ms ease;
        }

        .tab-btn:hover {
          opacity: 1;
        }

        .tab-btn:focus,
        .tab-btn:active,
        .tab-btn:focus-visible {
          opacity: 1;
          color: var(--color-link);
          outline: none;
          box-shadow: none;
        }

        .tab-btn-active::after {
          transform: scaleX(1);
        }

        .section-shell {
          margin-top: 0;
        }

        .section-work {
          position: relative;
        }

        .work-desktop {
          display: block;
        }

        .work-mobile {
          display: none;
        }

        .work-phase {
          position: relative;
        }

        .work-phase-hero {
          min-height: 196vh;
        }

        .work-phase-cluster {
          min-height: 172vh;
          margin-top: 10px;
        }

        .work-phase-sticky {
          position: sticky;
          top: calc(var(--nav-height) + 8px);
          min-height: calc(100vh - var(--nav-height) - 8px);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          overflow: visible;
          z-index: 3;
        }

        .work-phase-cluster .work-phase-sticky {
          justify-content: flex-end;
        }

        .macbook-phase-mockup {
          position: absolute;
          right: 0;
          bottom: 0;
          width: auto;
          max-width: min(64vw, 980px);
          max-height: 60vh;
          height: auto;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .hero-swap-stack {
          position: relative;
          width: 100%;
          min-height: calc(100vh - var(--nav-height) - 12px);
          display: flex;
          align-items: center;
          z-index: 5;
        }

        .hero-copy-layer {
          width: var(--vertical-card-w);
          transition: opacity 220ms ease;
        }

        .hero-bio {
          margin: 0;
          max-width: 860px;
          font-size: clamp(2.2rem, 6.28vw, 5.35rem);
          line-height: 1.03;
          letter-spacing: -0.022em;
          position: relative;
          z-index: 6;
          display: inline-block;
        }

        .phase-card-one {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          transition: opacity 120ms linear;
        }

        .phase-card-two {
          position: relative;
          z-index: 7;
        }

        .iphone-cluster-fixed {
          position: fixed;
          left: 0;
          bottom: 0;
          width: min(64vw, 980px);
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          pointer-events: none;
          user-select: none;
          opacity: 0;
          transition: opacity 160ms linear;
          z-index: 4;
        }

        .iphone-cluster-fixed.is-visible {
          opacity: 1;
        }

        .iphone-cluster-fixed img,
        .iphone-cluster-mobile img {
          width: 48%;
          height: auto;
          display: block;
        }

        .iphone-back-left {
          transform: scale(0.92) translateY(10px);
          z-index: 1;
        }

        .iphone-front-center {
          margin-left: -22%;
          margin-right: -22%;
          transform: scale(1);
          z-index: 3;
        }

        .iphone-back-right {
          transform: scale(0.92) translateY(10px);
          z-index: 2;
        }

        .cluster-clearance {
          height: var(--work-gap);
        }

        .work-grid-post {
          display: flex;
          flex-direction: column;
          gap: var(--work-gap);
          position: relative;
          z-index: 5;
        }

        .project-card {
          position: relative;
          min-height: 0;
          background: #171717;
          border: 1px solid var(--card-outline);
          border-radius: var(--radius-lg);
          padding: var(--card-pad);
          overflow: visible;
          transition: opacity 280ms ease, transform 280ms ease;
        }

        .project-card.half-left,
        .project-card.half-right,
        .project-card.info-card {
          width: var(--vertical-card-w);
          display: block;
        }

        .project-card.half-left {
          align-self: flex-start;
        }

        .project-card.half-right {
          align-self: flex-end;
        }

        .project-card.full-left-media,
        .project-card.full-right-media {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, var(--media-box-w)) minmax(0, 1fr);
          gap: var(--card-pad);
          align-items: stretch;
        }

        .project-card.full-right-media .project-media-wrap {
          order: 2;
        }

        .project-card.full-right-media .card-content {
          order: 1;
        }

        .project-media-wrap {
          width: 100%;
          height: var(--work-media-h);
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid rgba(199, 224, 223, 0.36);
          background: var(--color-bg);
          display: grid;
          place-items: center;
        }

        .project-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: var(--card-pad);
          padding: 0;
          overflow: visible;
        }

        .project-card.full-left-media .card-content,
        .project-card.full-right-media .card-content {
          justify-content: flex-start;
          align-self: start;
        }

        .project-card.half-left .card-content,
        .project-card.half-right .card-content {
          justify-content: flex-start;
          align-self: start;
        }

        /* Shared pointer base — rotated-square technique for antialiased edges */
        .project-card.pointer-right::before,
        .project-card.pointer-right::after,
        .project-card.pointer-left::before,
        .project-card.pointer-left::after,
        .project-card.pointer-top::before,
        .project-card.pointer-top::after,
        .project-card.pointer-bottom::before,
        .project-card.pointer-bottom::after {
          content: "";
          display: block;
          position: absolute;
          pointer-events: none;
        }

        /* pointer-right */
        .project-card.pointer-right::before {
          right: 0;
          top: 50%;
          width: calc(var(--pointer-size) * 1.42);
          height: calc(var(--pointer-size) * 1.42);
          background: #171717;
          border: 1px solid var(--card-outline);
          transform: translateY(-50%) translateX(50%) rotate(45deg);
          z-index: 2;
        }

        .project-card.pointer-right::after {
          right: 0px;
          top: 50%;
          width: calc(var(--pointer-size) + 3px);
          height: calc(var(--pointer-size) * 2 + 3px);
          background: #171717;
          transform: translateY(-50%);
          z-index: 3;
        }

        /* pointer-left */
        .project-card.pointer-left::before {
          left: 0;
          top: 50%;
          width: calc(var(--pointer-size) * 1.42);
          height: calc(var(--pointer-size) * 1.42);
          background: #171717;
          border: 1px solid var(--card-outline);
          transform: translateY(-50%) translateX(-50%) rotate(45deg);
          z-index: 2;
        }

        .project-card.pointer-left::after {
          left: 0;
          top: 50%;
          width: calc(var(--pointer-size) + 3px);
          height: calc(var(--pointer-size) * 2 + 3px);
          background: #171717;
          transform: translateY(-50%);
          z-index: 3;
        }

        /* pointer-top */
        .project-card.pointer-top::before {
          left: 50%;
          top: 0;
          width: calc(var(--pointer-size) * 1.42);
          height: calc(var(--pointer-size) * 1.42);
          background: #171717;
          border: 1px solid var(--card-outline);
          transform: translateX(-50%) translateY(-50%) rotate(45deg);
          z-index: 2;
        }

        .project-card.pointer-top::after {
          left: 50%;
          top: 0;
          width: calc(var(--pointer-size) * 2 + 3px);
          height: calc(var(--pointer-size) + 3px);
          background: #171717;
          transform: translateX(-50%);
          z-index: 3;
        }

        /* pointer-bottom */
        .project-card.pointer-bottom::before {
          left: 50%;
          bottom: 1;
          width: calc(var(--pointer-size) * 1.42);
          height: calc(var(--pointer-size) * 1.42);
          background: #171717;
          border: 1px solid var(--card-outline);
          transform: translateX(-50%) translateY(50%) rotate(45deg);
          z-index: 2;
        }

        .project-card.pointer-bottom::after {
          left: 50%;
          bottom: 0;
          width: calc(var(--pointer-size) * 2 + 3px);
          height: calc(var(--pointer-size) + 3px);
          background: #171717;
          transform: translateX(-50%);
          z-index: 3;
        }

        .project-card .card-content h2 {
          color: #ffffff;
        }

        .project-card .card-content p {
          color: #c7e0df;
        }

        .card-content h2 {
          margin: 0;
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          line-height: 1.06;
          letter-spacing: -0.01em;
        }

        .card-content p {
          margin: 0;
          font-size: 1.06rem;
          line-height: 1.55;
          max-width: 44ch;
        }

        .section-heading-wrap h1 {
          margin: 20px 0 0;
          font-size: clamp(2rem, 5vw, 3rem);
          letter-spacing: -0.02em;
        }

        .stack-list {
          display: grid;
          gap: 28px;
          margin-top: 26px;
        }

        .split-card {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 24px;
          background: #F1FDFA;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 22px;
        }

        .split-card-reverse {
          grid-template-columns: 1fr 1.1fr;
        }

        .split-card-reverse .card-media-wrap {
          order: 2;
        }

        .split-card-reverse .card-content {
          order: 1;
        }

        .card-media-wrap {
          min-height: 260px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.5);
        }

        .card-media {
          width: 100%;
          height: 100%;
          min-height: 260px;
          object-fit: cover;
          display: block;
        }

        .contact-grid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        .contact-copy,
        .section-heading-wrap {
          overflow: visible;
        }

        .contact-copy h1 {
          margin: 0;
          font-size: clamp(1.84rem, 5.21vw, 4.46rem);
          font-weight: 400;
          letter-spacing: -0.02em;
        }

        .contact-copy p {
          margin-top: 14px;
          font-size: 1.12rem;
          line-height: 1.6;
          max-width: 42ch;
        }

        .contact-form {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: grid;
          gap: 10px;
        }

        .contact-form label {
          font-size: 0.96rem;
          margin-top: 6px;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          border-radius: 10px;
          border: 1px solid rgba(23, 23, 23, 0.4);
          background: rgba(255, 255, 255, 0.66);
          color: var(--color-text);
          padding: 10px 12px;
          font: inherit;
          font-size: 1rem;
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 170px;
        }

        .contact-form button {
          margin-top: 8px;
          justify-self: start;
          appearance: none;
          border: 1px solid var(--color-link);
          border-radius: 999px;
          background: var(--color-link);
          color: #ffffff;
          font: inherit;
          padding: 10px 22px;
          cursor: pointer;
          transition: opacity 150ms ease;
        }

        .contact-form button:hover {
          opacity: 0.88;
        }

        .cv-header {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }

        .cv-header h1 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3rem);
          letter-spacing: -0.02em;
        }

        .download-btn {
          color: #ffffff;
          background: var(--color-link);
          border: 1px solid var(--color-link);
          border-radius: 999px;
          padding: 10px 16px;
          text-decoration: none;
          font-size: 0.95rem;
        }

        .cv-embed-shell {
          margin-top: 20px;
          min-height: min(70vh, 820px);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          overflow: hidden;
          background: rgba(255, 255, 255, 0.66);
        }

        .cv-embed {
          width: 100%;
          height: min(70vh, 820px);
          display: block;
          border: none;
        }

        .cv-embed-shell p {
          margin: 0;
          padding: 20px;
        }

        .cv-embed-shell a {
          color: var(--color-link);
        }

        .text-reveal {
          display: block;
          overflow: visible;
          margin-left: calc(-1 * var(--slide-distance));
          padding-left: var(--slide-distance);
          opacity: 0;
          transform: translateX(calc(-1 * var(--slide-distance)));
          transition: opacity 420ms ease, transform 420ms ease;
          will-change: opacity, transform;
        }

        .text-reveal.is-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .card-content.text-reveal {
          display: flex;
        }

        .bio-accent {
          color: var(--color-link);
        }

        p.hero-bio {
          margin-left: clamp(-180px, -22vw, -60px);
          padding-left: 0;
        }

        @media (max-width: 1140px) {
          .hero-bio {
            font-size: clamp(2rem, 5.6vw, 4.7rem);
            max-width: 760px;
          }

          p.hero-bio {
            margin-left: clamp(-180px, -10vw, -100px);
          }

          .macbook-phase-mockup {
            max-width: min(66vw, 860px);
          }
        }

        @media (max-width: 940px) {
          :root {
            --mobile-flow-gap: clamp(24px, 6vw, 34px);
          }

          .site-shell,
          .site-nav-inner {
            width: min(var(--max-width), calc(100% - 32px));
          }

          .site-shell {
            padding-bottom: var(--mobile-flow-gap) !important;
          }

          .site-nav-tabs {
            gap: 18px;
          }

          .work-desktop {
            display: none;
          }

          .work-mobile {
            display: block;
            padding-top: var(--mobile-flow-gap);
            padding-bottom: 0;
          }

          .work-mobile > * + * {
            margin-top: var(--mobile-flow-gap);
          }

          .work-mobile-hero .hero-bio {
            margin-left: 0;
            max-width: none;
            font-size: calc((100vw - 32px) / 9);
            line-height: 1.06;
          }

          .mobile-macbook-wrap {
            display: flex;
            justify-content: center;
          }

          .mobile-macbook-wrap img {
            display: block;
            width: min(100%, 780px);
            height: auto;
            max-height: 60vh;
          }

          .iphone-cluster-mobile {
            width: min(100%, 780px);
            margin: 0 auto;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .iphone-cluster-mobile .iphone-back-left,
          .iphone-cluster-mobile .iphone-back-right {
            transform: translateY(-42px) scale(0.92);
          }

          .iphone-cluster-mobile .iphone-front-center {
            transform: translateY(-40px) scale(1);
          }

          .project-card.info-card,
          .project-card.full-left-media,
          .project-card.full-right-media {
            width: 100%;
            align-self: stretch;
          }

          .mobile-macbook-wrap + .project-card.pointer-top {
            margin-top: calc(var(--mobile-flow-gap) + var(--pointer-protrusion));
          }

          .project-card.pointer-bottom + .iphone-cluster-mobile {
            margin-top: calc(var(--mobile-flow-gap) + 30px) !important;
          }

          .project-card.full-left-media,
          .project-card.full-right-media {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
          }

          .iphone-cluster-mobile + .work-grid-post {
            margin-top: calc(var(--mobile-flow-gap) - 40px) !important;
          }

          .work-grid-post {
            gap: var(--mobile-flow-gap);
          }

          .project-card.full-right-media .project-media-wrap,
          .project-card.full-right-media .card-content {
            order: initial;
          }

          .project-media-wrap {
            width: 100%;
            height: 300px;
          }

          .project-card.pointer-right::before,
          .project-card.pointer-right::after,
          .project-card.pointer-left::before,
          .project-card.pointer-left::after {
            display: none;
          }

          .project-card.pointer-top::before,
          .project-card.pointer-top::after,
          .project-card.pointer-bottom::before,
          .project-card.pointer-bottom::after {
            display: block;
          }

          .split-card,
          .split-card-reverse {
            grid-template-columns: 1fr;
          }

          .split-card-reverse .card-media-wrap,
          .split-card-reverse .card-content {
            order: initial;
          }

          .contact-grid {
            margin-top: 0;
            padding-top: var(--mobile-flow-gap);
            gap: 14px;
            grid-template-columns: 1fr;
          }

          .contact-copy {
            display: grid;
            gap: 14px;
          }

          .contact-copy h1 {
            font-size: calc((100vw - 32px) / 7.5);
            line-height: 1.06;
            max-width: none;
            font-weight: 400;
          }

          .contact-copy p {
            margin-top: 0;
          }

          .stack-list {
            margin-top: 0;
            padding-top: calc(var(--mobile-flow-gap) + 5px);
          }

          .site-nav {
            background: var(--color-bg);
            backdrop-filter: none;
          }

        }

        @media (max-width: 560px) {
          .site-shell,
          .site-nav-inner {
            width: min(var(--max-width), calc(100% - 24px));
          }

          :root {
            --nav-height: 64px;
          }

          .site-nav-inner {
            height: 64px;
          }

          .site-nav-mark {
            width: 34px;
            height: 34px;
          }

          .site-nav-tabs {
            gap: 14px;
          }

          .tab-btn {
            font-size: 0.92rem;
          }

          .project-card,
          .split-card {
            padding: 16px;
          }

          .project-media-wrap,
          .card-media {
            min-height: 240px;
          }

          .card-content p {
            font-size: 1rem;
          }

          .work-mobile-hero .hero-bio {
            font-size: calc((100vw - 24px) / 9);
          }

          .contact-copy h1 {
            font-size: calc((100vw - 24px) / 8.6);
          }
        }
      `}</style>

      <nav className={`site-nav${navShadow ? " nav-shadow" : ""}`} aria-label="Primary">
        <div className="site-nav-inner">
          <div className="site-nav-brand">
            <img className="site-nav-mark" src="./ds4.svg" alt="DS logo" width="40" height="40" />
          </div>

          <div className="site-nav-tabs">
            {TABS.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  className={`tab-btn ${isActive ? "tab-btn-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="site-shell">
        {activeTab === "WORK" && <WorkSection />}
        {activeTab === "ABOUT" && <AboutSection />}
        {activeTab === "CONTACT" && <ContactSection />}
        {activeTab === "CV" && <CvSection />}
      </div>
    </div>
  );
}

const rootEl = document.getElementById("profile-motion-root");
if (rootEl) {
  createRoot(rootEl).render(<PortfolioApp />);
}
