import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Projects.css";

import GhostSpirit from "../components/Projects/GhostSpirit";
import FishSpirit from "../components/Projects/FishSpirit";
import home_page_shot from "../assets/home_page_shot.png"
import idle from "../assets/idle.png";
import hurt from "../assets/hurt.png";
import excited from "../assets/excited.png";
import smug from "../assets/smug.png";
import thinking from "../assets/thinking.png";

import happy1 from "../assets/happy1.png";
import happy2 from "../assets/happy2.png";
import happy3 from "../assets/happy3.png";
import happy4 from "../assets/happy4.png";

const PROJECTS = [
  {
    id: "001",
    name: "SIGRUNA",
    status: "ACTIVE",
    stack: ["React", "Vite", "CSS"],
    image: home_page_shot,
    summary: "Personal site.",
    description: "you are here",
    npcDialogue: "Ugly ass homepage", 
    npcMood: "smug",
    modalDialogue: "Weird looking website LOL",
    modalMood: "smug",
    links: { github: null, demo: null },
    log: [
      { date: "2026-07-23", msg: "Built projects page" },
      { date: "2026-07-18", msg: "Built home page" },
    ],
  },
];

const STATUS_STYLES = { ACTIVE: "status--active", COMPLETE: "status--complete", ARCHIVED: "status--archived" };
const STATUS_LABELS = { ACTIVE: "GROWING", COMPLETE: "BLOOMED", ARCHIVED: "DORMANT" };
const BOOT_LINES = ["drifting through the fog...", "you realise you are here", "welcome to the garden"];
const NAV_LINKS = [
  { label: "HOME", path: "/" }, { label: "PROJECTS", path: "/projects" },
  { label: "GALLERY", path: "/gallery" }, { label: "CONTACT", path: "/contact" },
  { label: "BOOK", path: "/book" }, { label: "PLAYPEN", path: "/playpen" },
];

const NAV_DIALOGUE = {
  "/": { 
    text: "returning to the sea...", 
    mood: "thinking" 
  },
  "/projects": { 
    text: "you are here, STUPID.", 
    mood: "happy" 
  },
  "/gallery": { 
    text: "accessing visual logs.", 
    mood: "excited" 
  },
  "/contact": { 
    text: "want to talk to me? LOL", 
    mood: "thinking" 
  },
  "/book": { 
    text: "opening the main ledger.", 
    mood: "idle" 
  },
  "/playpen": { 
    text: "welcome to my house!", 
    mood: "smug" 
  }
};

const MOOD_ASSETS = {
  idle,
  hurt,
  thinking: thinking,
  excited,
  smug,

  happy: [
    happy1,
    happy2,
    happy3,
    happy4,
  ],
};

const getPositions = () => ({
  home: {
    x: 100,
    y: window.innerHeight - 150,
  },

  navbar: {
    x: window.innerWidth - 300,
    y: 100,
  },

  project1: {
    x: 250,
    y: 400,
  },

  project2: {
    x: 550,
    y: 400,
  },
});

const IDLE_LINES = ["Why is this place so green", "Do you want to open one?", "You have been here a lonnggggg time"];
const HURT_LINES = ["Ouchie ouch!", "Ow!", "That hurt...", "Be gentle!"];

// ── Main Page Component ────────────────────────────
export default function Projects() {
  const [booted, setBooted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [dossierReady, setDossierReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

// Companion State
const [npcState, setNpcState] = useState({
  position: "home",
  coords: getPositions().home,
  mood: "idle",
  dialogue: "Welcome to the archives."
});

const idleTimerRef = useRef(null);

// Companion Action Controller
// Companion Action Controller
const speak = ({ moveTo, coords, mood, text }) => {
  setNpcState((prev) => ({
    coords: coords || (moveTo ? getPositions()[moveTo] : prev.coords),
    mood: mood || "idle",
    dialogue: text || ""
  }));

  // 1. Clear any running timer whenever the user interacts
  if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

  // 2. Define a function that updates her dialogue and loops itself
  const startIdleLoop = () => {
    setNpcState((prev) => ({
      ...prev,
      mood: "idle",
      dialogue: IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)]
    }));

    // Reschedule the next idle line 10 seconds from now
    idleTimerRef.current = setTimeout(startIdleLoop, 20000);
  };

  // 3. Start the first 10-second timer
  idleTimerRef.current = setTimeout(startIdleLoop, 20000);
};

  useEffect(() => {
      if (selectedId) {
        const project = PROJECTS.find((p) => p.id === selectedId);
        if (project) {
          speak({
            mood: project.modalMood || "happy", // Uses the card's specific mood
            text: project.modalDialogue || `Opening dossier on ${project.name}...`
          });
        }
      }
    }, [selectedId]);

  // Boot sequence
  useEffect(() => {
    speak({ moveTo: "home", mood: "idle", text: "Welcome to the archives." }); // Initial greeting
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setBooted(true); return; }
    const t = setTimeout(() => setBooted(true), 1800);
    return () => {
      clearTimeout(t);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const allImages = [
      ...Object.values(MOOD_ASSETS).flatMap((v) => (Array.isArray(v) ? v : [v])),
    ];
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Fake decrypt delay
  useEffect(() => {
    if (!selectedId) return;
    setDossierReady(false);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setDossierReady(true); return; }
    const t = setTimeout(() => setDossierReady(true), 500);
    return () => clearTimeout(t);
  }, [selectedId]);

  // Escape closes dossier
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e) => { if (e.key === "Escape") setSelectedId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  useEffect(() => {
  const handleResize = () => {
    setNpcState((prev) => {
      // Don't move NPC if it's standing beside a project card
      if (
        prev.coords &&
        prev.position !== "home" &&
        prev.position !== "navbar"
      ) {
        return prev;
      }

      return {
        ...prev,
        coords: getPositions()[prev.position],
      };
    });
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  const selected = PROJECTS.find((p) => p.id === selectedId) ?? null;

  return (
    <main className={`archive ${booted ? "archive--booted" : ""}`}>
      <div className="archive__glow" aria-hidden="true" />
      <div className="archive__mist" aria-hidden="true" />
      <div className="archive__particles" aria-hidden="true" />

      <GhostSpirit />
      <FishSpirit />

      <button
        className={`surface-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        onMouseEnter={() => speak({ moveTo: "navbar", mood: "thinking", text: "Need to go somewhere else?" })}
        aria-label="Toggle menu"
      >
        <span className="surface-toggle-core" />
      </button>

      <nav className={`surface-menu ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => {
          const navItem = NAV_DIALOGUE[link.path] || { 
            text: "navigating away?", 
            mood: "thinking" 
          };

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`surface-menu-link ${
                link.path === "/projects" ? "active" : ""
              }`}
              onMouseEnter={() =>
                speak({
                  moveTo: "navbar",
                  mood: navItem.mood, // Dynamic mood per link
                  text: navItem.text,
                })
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <header className="archive__header">
        <div className="archive__boot" aria-hidden={booted}>
          {BOOT_LINES.map((line, i) => (
            <span key={line} className="archive__boot-line" style={{ animationDelay: `${i * 0.32}s` }}>
              {line}
            </span>
          ))}
        </div>
        <h1 className="archive__title">NIGHT GARDEN<span className="archive__cursor" aria-hidden="true">_</span></h1>
        <p className="archive__subtitle">{PROJECTS.length} things grown here — touch one to look closer</p>
      </header>

      <section className="archive__grid">
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            className="dossier-card"
            onClick={() => setSelectedId(project.id)}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              speak({
                coords: {
                  x: rect.left - 70,
                  y: rect.top + 10
                },
                mood: project.npcMood || (project.status === "ACTIVE" ? "excited" : "happy"),
                text: project.npcDialogue || `Inspecting ${project.name}...`
              });
            }}
          >
            <div className="dossier-card__top">
              <span className="dossier-card__id">[{project.id}]</span>
              <span
                className={`dossier-card__status ${
                  STATUS_STYLES[project.status]
                }`}
              >
                {STATUS_LABELS[project.status]}
              </span>
            </div>

            <div className="dossier-card__shot">
              {project.image ? (
                <img src={project.image} alt={project.name} />
              ) : (
                <div className="dossier-card__noshot">still forming...</div>
              )}
            </div>

            <h2 className="dossier-card__name">{project.name}</h2>
            <p className="dossier-card__summary">{project.summary}</p>

            <div className="dossier-card__stack">
              {project.stack.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>

            <span className="dossier-card__open">look closer ›</span>
          </button>
        ))}
      </section>

      {/* Dossier Modal Code Remains Exactly the Same */}
      {selected && (
        <div
          className="dossier-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} dossier`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <div className="dossier-modal__panel">
            <button
              className="dossier-modal__close"
              onClick={() => setSelectedId(null)}
            >
              step back ✕
            </button>

            {!dossierReady ? (
              <div className="dossier-modal__decrypt">
                <div className="dossier-modal__bar" />
                the fog is clearing on [{selected.id}]...
              </div>
            ) : (
              <div className="dossier-modal__content">
                <div className="dossier-modal__head">
                  <span className="dossier-card__id">[{selected.id}]</span>
                  <span
                    className={`dossier-card__status ${
                      STATUS_STYLES[selected.status]
                    }`}
                  >
                    {STATUS_LABELS[selected.status]}
                  </span>
                </div>

                <h2 className="dossier-modal__title">{selected.name}</h2>

                {/* 🟩 Restored Modal Image Shot */}
                <div className="dossier-modal__shot dossier-modal__shot--lg">
                  {selected.image ? (
                    <img src={selected.image} alt={selected.name} />
                  ) : (
                    <div className="dossier-card__noshot">still forming...</div>
                  )}
                </div>

                <p className="dossier-modal__desc">{selected.description}</p>

                <div className="dossier-card__stack">
                  {selected.stack.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="dossier-modal__links">
                  {selected.links?.github && (
                    <a
                      href={selected.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="dossier-modal__link"
                    >
                      SOURCE ↗
                    </a>
                  )}
                  {selected.links?.demo && (
                    <a
                      href={selected.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="dossier-modal__link"
                    >
                      LIVE DEMO ↗
                    </a>
                  )}
                </div>

                {selected.log && selected.log.length > 0 && (
                  <div className="dossier-modal__log">
                    <p className="dossier-modal__log-title">how it grew</p>
                    {selected.log.map((entry) => (
                      <div key={entry.date} className="dossier-modal__log-line">
                        <span className="dossier-modal__log-date">
                          {entry.date}
                        </span>
                        {entry.msg}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Render the Local Companion Here ── */}
      <Companion state={npcState} speak={speak} />
    </main>
  );
}

function Companion({ state, speak }) {
  const { coords, mood, dialogue } = state;
  const [happyFrame, setHappyFrame] = useState(0);

  useEffect(() => {
    if (mood !== "happy") {
      setHappyFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setHappyFrame((prev) => (prev + 1) % 4);
    }, 1000); // adjust speed here

    return () => clearInterval(interval);
  }, [mood]);
  
  const targetCoords = coords || getPositions().home;

  const handlePoke = () => {
    speak({ mood: "hurt", text: HURT_LINES[Math.floor(Math.random() * HURT_LINES.length)] });
  };

  let currentImage = MOOD_ASSETS.idle;

  if (mood === "happy") {
    currentImage = MOOD_ASSETS.happy[happyFrame];
  } else {
    currentImage = MOOD_ASSETS[mood] || MOOD_ASSETS.idle;
  }

  return (
    <div 
      className={`npc-container ${mood}`} 
      style={{ transform: `translate(${targetCoords.x}px, ${targetCoords.y}px)` }}
    >
      {dialogue && (
        <div className="npc-speech-bubble">
          {dialogue}
        </div>
      )}
      
      <div className="npc-sprite" onClick={handlePoke}>
        {currentImage && (
          <img src={currentImage} alt={`Companion is ${mood}`} className="npc-image" />
        )}
      </div>
    </div>
  );
}