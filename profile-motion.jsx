import React, { useEffect, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const TABS = ["WORK", "ABOUT", "CONTACT", "CV"];

const BIO_TEXT = "Hi, I'm Dan, product designer with a background in data & mathematics.";
const CONTACT_EMAIL = "danwk@naver.com";
const CONTACT_SUBJECT = "Portfolio inquiry";
const CV_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const workItems = [
  {
    title: "Custom dashboard platform with drag-and-drop analysis 'blocks'",
    description:
      "Designed a modular analytics workflow where users assemble reusable analysis blocks and build dashboards without writing code.",
    image: "./mbmu.png",
    alt: "Project 01 mockup",
    mediaShape: "vertical",
  },
  {
    title: "ML-powered news article vocab acquisition iOS app",
    description:
      "Shaped the product experience for a mobile learning app that extracts high-value vocabulary from live news content and personalizes review.",
    image: "./ipmu.png",
    alt: "Project 02 mockup",
    mediaShape: "horizontal",
  },
  {
    title: "Data consultancy company website visual & structural overhaul",
    description:
      "Reworked information architecture and visual hierarchy to better communicate services, case studies, and trust signals for new clients.",
    image: "https://placehold.co/1200x760/171717/c7e0df?text=Project+03",
    alt: "Project 03 placeholder",
    mediaShape: "horizontal",
  },
  {
    title: "Placeholder 4",
    description:
      "Reserved for an additional case study card with project summary, outcomes, and links once final assets are ready.",
    image: "https://placehold.co/860x1140/171717/c7e0df?text=Project+04",
    alt: "Project 04 placeholder",
    mediaShape: "vertical",
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

function RevealText({ children, className = "", as: Tag = "div" }) {
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
    <Tag ref={ref} className={`text-reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </Tag>
  );
}

function WorkSection() {
  const secondCardRef = useRef(null);
  const fourthCardRef = useRef(null);
  const [pastSecondThreshold, setPastSecondThreshold] = useState(false);
  const [atFourthZone, setAtFourthZone] = useState(false);

  useEffect(() => {
    const secondEl = secondCardRef.current;
    const fourthEl = fourthCardRef.current;
    if (!secondEl || !fourthEl) return undefined;

    const updateMockupState = () => {
      const viewportHeight = window.innerHeight || 0;
      const secondTop = secondEl.getBoundingClientRect().top;
      const fourthTop = fourthEl.getBoundingClientRect().top;

      const nextPastSecond = secondTop <= viewportHeight * 0.72;
      const nextAtFourth = fourthTop <= viewportHeight * 0.86;

      setPastSecondThreshold((prev) => (prev === nextPastSecond ? prev : nextPastSecond));
      setAtFourthZone((prev) => (prev === nextAtFourth ? prev : nextAtFourth));
    };

    updateMockupState();

    window.addEventListener("scroll", updateMockupState, { passive: true });
    window.addEventListener("resize", updateMockupState);

    return () => {
      window.removeEventListener("scroll", updateMockupState);
      window.removeEventListener("resize", updateMockupState);
    };
  }, []);

  const showCornerMockup = atFourthZone;
  const showHandMockup = !pastSecondThreshold && !showCornerMockup;

  return (
    <section className="section-shell section-work">
      <img
        className={`hero-corner-mockup ${showHandMockup ? "" : "is-hidden"}`.trim()}
        src="./handmockup2.png"
        alt="Hand device mockup"
        aria-hidden="true"
      />

      <img
        className={`work-corner-mockup ${showCornerMockup ? "is-visible" : ""}`.trim()}
        src="./mbmu2.png"
        alt="Bottom-left corner dashboard mockup"
        aria-hidden="true"
      />

      <header className="hero-block">
        <RevealText as="p" className="hero-bio">
          {BIO_TEXT}
        </RevealText>
      </header>

      <div className="work-grid">
        {workItems.map((item, index) => {
          const itemNum = index + 1;
          const isSecond = itemNum === 2;
          const isFourth = itemNum === 4;

          return (
            <article
              key={item.title}
              ref={isSecond ? secondCardRef : isFourth ? fourthCardRef : undefined}
              className={`project-card layout-${item.mediaShape} placement-${itemNum}`}
            >
              <div className="project-media-wrap">
                <img className="project-media" src={item.image} alt={item.alt} loading="lazy" />
              </div>

              <RevealText className="card-content">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </RevealText>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section-shell">
      <header className="section-heading-wrap">
        <RevealText as="h1">About</RevealText>
      </header>

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
          <h1>Get in touch</h1>
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
        <RevealText as="h1">CV</RevealText>
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
          --vertical-card-w: calc((100% - var(--work-gap)) / 2);
          --media-box-w: 500px;
          --work-media-h: 320px;
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
          z-index: 30;
          height: var(--nav-height);
          background: rgba(199, 224, 223, 0.94);
          backdrop-filter: blur(2px);
        }

        .site-nav-inner {
          height: 100%;
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
          opacity: 0.72;
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

        .hero-block {
          position: relative;
          min-height: clamp(480px, 68vh, 760px);
          padding: 42px 0 14px;
          overflow: visible;
        }

        .hero-bio {
          margin: 0;
          margin-top: clamp(54px, 7vh, 104px);
          margin-left: clamp(-230px, -12vw, -170px);
          max-width: 860px;
          font-size: clamp(2.45rem, 6.95vw, 5.95rem);
          line-height: 1.03;
          letter-spacing: -0.022em;
          position: relative;
          z-index: 6;
          display: inline-block;
        }

        .hero-corner-mockup {
          position: fixed;
          right: 0;
          bottom: 0;
          width: clamp(256px, 36.8vw, 624px);
          height: auto;
          pointer-events: none;
          user-select: none;
          z-index: 3;
          transform: translateX(0);
          opacity: 1;
          transition: transform 380ms ease, opacity 380ms ease;
        }

        .hero-corner-mockup.is-hidden {
          transform: translateX(140px);
          opacity: 0;
        }

        .work-corner-mockup {
          position: fixed;
          left: -140px;
          bottom: -24px;
          width: clamp(420px, 56vw, 1080px);
          height: auto;
          pointer-events: none;
          user-select: none;
          z-index: 4;
          opacity: 0;
          transform: translateX(-40px);
          transition: transform 420ms ease, opacity 420ms ease;
        }

        .work-corner-mockup.is-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .work-grid {
          display: flex;
          flex-direction: column;
          gap: var(--work-gap);
          margin-top: 0;
          position: relative;
          z-index: 5;
        }

        .project-card {
          min-height: 0;
          background: #171717;
          border: 1px solid rgba(199, 224, 223, 0.26);
          border-radius: var(--radius-lg);
          padding: var(--card-pad);
          overflow: hidden;
        }

        .placement-1 {
          width: var(--vertical-card-w);
          align-self: flex-start;
        }

        .placement-2,
        .placement-3 {
          width: 100%;
        }

        .placement-4 {
          width: var(--vertical-card-w);
          align-self: flex-end;
        }

        .layout-horizontal {
          display: grid;
          grid-template-columns: minmax(0, var(--media-box-w)) minmax(0, 1fr);
          gap: var(--card-pad);
          align-items: start;
          min-height: var(--vertical-card-w);
        }

        .layout-vertical {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
          gap: var(--card-pad);
          align-content: start;
        }

        .project-media-wrap {
          width: min(100%, var(--media-box-w));
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
          object-fit: contain;
          display: block;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: var(--card-pad);
          padding: 0;
          overflow: visible;
        }

        .layout-horizontal .card-content {
          justify-content: flex-start;
          align-self: start;
        }

        .layout-vertical .card-content {
          justify-content: flex-start;
          align-self: start;
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
          background: var(--color-surface);
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
          margin-top: 24px;
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
          font-size: clamp(2rem, 4vw, 3rem);
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
          justify-content: space-between;
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

        @media (max-width: 1140px) {
          .hero-bio {
            margin-left: clamp(-96px, -6vw, -56px);
            margin-top: 28px;
            font-size: clamp(2.2rem, 6vw, 4.8rem);
            max-width: 760px;
          }

          .hero-block {
            min-height: clamp(390px, 58vh, 620px);
          }

          .hero-corner-mockup {
            width: clamp(230px, 34vw, 500px);
            right: 0;
          }
        }

        @media (max-width: 940px) {
          .site-shell {
            width: min(var(--max-width), calc(100% - 32px));
          }

          .site-nav-tabs {
            gap: 18px;
          }

          .hero-block {
            min-height: clamp(360px, 56vh, 520px);
          }

          .hero-corner-mockup {
            width: clamp(220px, 40vw, 460px);
            right: 0;
          }

          .work-corner-mockup {
            left: -96px;
            width: clamp(340px, 58vw, 680px);
          }

          .work-grid {
            gap: 28px;
          }

          .placement-1,
          .placement-2,
          .placement-3,
          .placement-4 {
            width: 100%;
            align-self: stretch;
          }

          .layout-horizontal,
          .layout-vertical {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
          }

          .project-media-wrap {
            width: 100%;
            height: 300px;
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
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .site-shell {
            width: min(var(--max-width), calc(100% - 24px));
          }

          .site-nav {
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

          .hero-block {
            min-height: auto;
            padding-bottom: 12px;
          }

          .hero-corner-mockup,
          .work-corner-mockup {
            display: none;
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
        }
      `}</style>

      <div className="site-shell">
        <nav className="site-nav" aria-label="Primary">
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
