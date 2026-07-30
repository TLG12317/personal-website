import { useState, useEffect, useMemo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import "./Gallery.css";
import test from "../assets/test.png"
import gallery from "../assets/gallery.png"
import home_page_shot from "../assets/home_page_shot.png"

//art
const ARTWORKS = [
  { id: 1, title: "Banga Ho", year: 2026, medium: "banana-painting", description: "test", image: test, featured: true },
  { id: 2, title: "Gallery", year: 2026, medium: "banana oil", description: "it hella pink", image: gallery, featured: true },
  { id: 3, title: "Home Page", year: 2026, medium: "testicular torsionistic", description: "home page i think", image: home_page_shot, featured: true },
  { id: 4, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 5, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 6, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 7, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 8, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 9, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 10, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 11, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 12, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 13, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 14, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 15, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 16, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 17, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 18, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 19, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 20, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 21, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 22, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 23, title: "", year: 2026, medium: "", description: "", image: null },
  { id: 24, title: "", year: 2026, medium: "", description: "", image: null },
];

const PER_PAGE = 8;
const SLIDE_INTERVAL = 3000;

// ============================================================================
// FallingPetals
// Renders a field of drifting sakura petals.
// Purely decorative — sits behind pointer events so it never blocks clicks.
//
// Props:
//  - count   number of petals (default 20)
//  - variant "field" (full-page ambient drift) | "nav" (small, slow, subtle — for the navbar)
// ============================================================================
function FallingPetals({ count = 20, variant = "field" }) {
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = variant === "nav" ? 6 + Math.random() * 6 : 10 + Math.random() * 16;
      const duration = variant === "nav" ? 6 + Math.random() * 5 : 9 + Math.random() * 10;
      const delay = Math.random() * duration;
      const left = Math.random() * 100;
      const drift = (Math.random() - 0.5) * (variant === "nav" ? 40 : 140);
      const rotate = 180 + Math.random() * 360;
      const opacity = 0.35 + Math.random() * 0.5;
      const hueShift = Math.random() > 0.5 ? "petal--light" : "petal--dark";
      return { id: i, size, duration, delay, left, drift, rotate, opacity, hueShift };
    });
  }, [count, variant]);

  return (
    <div className={`petal-field petal-field--${variant}`} aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className={`petal ${p.hueShift}`}
          style={{
            "--size": `${p.size}px`,
            "--duration": `${p.duration}s`,
            "--delay": `-${p.delay}s`,
            "--left": `${p.left}%`,
            "--drift": `${p.drift}px`,
            "--rotate": `${p.rotate}deg`,
            "--opacity": p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// PetalNavbar
// Drop this in place of your current Navbar (or copy the classNames into it).
// Edit the `links` array to match your real routes.
// ============================================================================
const PETAL_NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
  { label: "Book", to: "/book" },
  { label: "Playpen", to: "/playpen" },
];

function PetalNavbar() {
  return (
    <nav className="petal-nav">
      <FallingPetals count={8} variant="nav" />
      <NavLink to="/" className="petal-nav-brand">Sigruna</NavLink>
      <ul className="petal-nav-list">
        {PETAL_NAV_LINKS.map((link, i) => (
          <li key={link.href} className="petal-nav-item" style={{ "--sway-delay": `${i * 0.4}s` }}>
            <NavLink
                to={link.to}
                className={({ isActive }) =>
                    `petal-nav-link ${isActive ? "is-active" : ""}`
                }
            >
                <span className="petal-nav-bud" aria-hidden="true" />
                {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ============================================================================
// Gallery
// Artwork data
// Swap `image: null` for a real path once you have thumbnails, e.g.
//   image: "/assets/works/moonlit-sakura.png"
// Until then, cards and the featured viewer fall back to a soft placeholder.
// The first three entries (`featured: true`) are what cycles through the
// viewer at the top right.
// ============================================================================

export default function Gallery() {
  const featured = useMemo(() => ARTWORKS.filter((a) => a.featured), []);
  const [slideIndex, setSlideIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [lightboxArt, setLightboxArt] = useState(null);

  const totalPages = Math.ceil(ARTWORKS.length / PER_PAGE);
  const pageItems = ARTWORKS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const activeDescription = hovered || selected;

  // Featured viewer autoplay — restarts whenever slideIndex changes,
  // so manual prev/next/dot clicks reset the countdown to the next slide.
  useEffect(() => {
    if (featured.length < 2) return;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % featured.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [featured.length, slideIndex]);

  // ESC closes the lightbox
  useEffect(() => {
    if (!lightboxArt) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxArt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxArt]);

  const goToPage = useCallback(
    (next) => {
      setPage((p) => Math.min(Math.max(next, 0), totalPages - 1));
    },
    [totalPages]
  );

  return (
    <main className="gallery">
      <PetalNavbar />
      <div className="gallery-scroll">
        <FallingPetals count={22} variant="field" />
        <div className="gallery-hero-inner">
          <section className="gallery-hero">
            <div className="gallery-hero-intro">
              <span className="gallery-eyebrow">🌸 Collection</span>
              <h1 className="gallery-title">Gallery</h1>
              <p className="gallery-subtitle">
                So many pretty pictures 
              </p>
            </div>

            <div className="gallery-viewer">
              <div className="viewer-frame">
                {featured.map((art, i) => (
                  <div
                    key={art.id}
                    className={`viewer-slide ${i === slideIndex ? "is-active" : ""}`}
                    style={art.image ? { backgroundImage: `url(${art.image})` } : undefined}
                  >
                    {!art.image && (
                      <div className="viewer-placeholder">
                        <span>🌸</span>
                        {art.title}
                      </div>
                    )}
                  </div>
                ))}
                {featured.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="viewer-arrow viewer-arrow--prev"
                      aria-label="Previous artwork"
                      onClick={() =>
                        setSlideIndex((i) => (i - 1 + featured.length) % featured.length)
                      }
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="viewer-arrow viewer-arrow--next"
                      aria-label="Next artwork"
                      onClick={() =>
                        setSlideIndex((i) => (i + 1) % featured.length)
                      }
                    >
                      ›
                    </button>
                  </>
                )}
                <div className="viewer-plaque">
                  <span className="viewer-plaque-title">{featured[slideIndex]?.title}</span>
                  <span className="viewer-plaque-year">{featured[slideIndex]?.year}</span>
                </div>
                {featured.length > 1 && (
                  <div className="viewer-dots" role="tablist" aria-label="Featured artwork">
                    {featured.map((art, i) => (
                      <button
                        key={art.id}
                        type="button"
                        role="tab"
                        aria-selected={i === slideIndex}
                        aria-label={`Show ${art.title}`}
                        className={`viewer-dot ${i === slideIndex ? "is-active" : ""}`}
                        onClick={() => setSlideIndex(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
        <div className="gallery-inner">


          <section className="gallery-main">
            <aside className="gallery-description">
              {activeDescription ? (
                <>
                  <h2 className="description-title">{activeDescription.title}</h2>
                  <div className="description-divider" />
                  <p className="description-meta">
                    {activeDescription.year} · {activeDescription.medium}
                  </p>
                  <p className="description-text">{activeDescription.description}</p>
                </>
              ) : (
                <p className="description-empty">Click on an image to check it out.</p>
              )}
            </aside>

            <div className="gallery-content">
              <div className="gallery-grid">
                {pageItems.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    className={`gallery-card ${selected?.id === art.id ? "is-selected" : ""}`}
                    onMouseEnter={() => setHovered(art)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      setSelected(art);
                      setLightboxArt(art);
                    }}
                    onFocus={() => setHovered(art)}
                    onBlur={() => setHovered(null)}
                  >
                    {art.image ? (
                      <img src={art.image} alt={art.title} className="card-image" />
                    ) : (
                      <div className="card-placeholder" aria-hidden="true">🌸</div>
                    )}
                    <span className="card-title">{art.title}</span>
                  </button>
                ))}
              </div>

              <nav className="gallery-pagination" aria-label="Gallery pages">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                >
                  ◀ Prev
                </button>
                <span className="pagination-status">
                  Page {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages - 1}
                >
                  Next ▶
                </button>
              </nav>
            </div>
          </section>
        </div>
      </div>

      {lightboxArt && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxArt.title}
          onClick={() => setLightboxArt(null)}
        >
          <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
            {lightboxArt.image ? (
              <img src={lightboxArt.image} alt={lightboxArt.title} className="lightbox-image" />
            ) : (
              <div className="lightbox-placeholder">
                <span>🌸</span>
                {lightboxArt.title}
              </div>
            )}
            <div className="lightbox-caption">
              <h3>{lightboxArt.title}</h3>
              <p>
                {lightboxArt.year} · {lightboxArt.medium}
              </p>
              <p>{lightboxArt.description}</p>
            </div>
            <button
              type="button"
              className="lightbox-close"
              aria-label="Close preview"
              onClick={() => setLightboxArt(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// Named exports in case you want to use these pieces elsewhere too.
export { FallingPetals, PetalNavbar };
