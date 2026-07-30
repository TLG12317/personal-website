import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Intro from "./components/Intro";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Book from "./pages/Book";
import Playpen from "./pages/Playpen";

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hasPlayed = sessionStorage.getItem("introPlayed") === "true";

  const [introFinished, setIntroFinished] = useState(!isHome || hasPlayed);
  const [introFading, setIntroFading] = useState(!isHome || hasPlayed);
  return (
    <>
      {/* Only mount the routes after the intro is gone */}
        <div className={`app-content ${introFading ? "app-content-visible" : ""}`}>
        <Routes>
            <Route>
            <Route
                path="/"
                element={<Home introFading={introFading} />}
            />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Book />} />
            <Route path="/playpen" element={<Playpen />} />
            </Route>
        </Routes>
        </div>

      {/* Intro */}
      {isHome && !introFinished && (
        <div className={`intro-overlay ${introFading ? "intro-overlay-out" : ""}`}>
          <Intro
            display="WELCOME."
            onFinish={() => {

            setIntroFading(true);

            setTimeout(() => {
                sessionStorage.setItem("introPlayed", "true");
                setIntroFinished(true);
            }, 600);

            }}
          />
        </div>
      )}
    </>
  );
}