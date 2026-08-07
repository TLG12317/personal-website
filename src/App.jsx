import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Intro from "./components/Intro";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Books from "./pages/Books";
import BookPage from "./pages/BookPage";
import Chapter from "./pages/Chapter";
import Playpen from "./pages/Playpen";
import AdminBook from "./pages/admin/AdminBook";
import AdminChapter from "./pages/admin/AdminChapter";
import AdminLogin from "./pages/AdminLogin"; 

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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route>
            <Route
                path="/"
                element={<Home introFading={introFading} />}
            />
            <Route path="/login" element={<Login />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/chapters/:id"
                element={<AdminChapter />}
            />
            <Route path="/admin/books/:id" element={<AdminBook />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:slug" element={<BookPage />} />
            <Route path="/books/:slug/:chapterId" element={<Chapter />} />
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
