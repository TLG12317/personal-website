import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import Navbar from "../components/Home/Navbar";
import Stars from "../components/Home/Stars";
import Rain from "../components/Home/Rain";
import SigrunaTitle from "../components/Home/SigrunaTitle";
import frankenthal from "../assets/frankenthal.png";

const STAR_COUNT = 30;
const RAIN_COUNT = 30;

const FloatingLabel = ({ text, className }) => (
  <span className={`floating-label ${className}`}>
    <span className="nav-text">
      {text.split("").map((letter, i) => (
        <span
          key={i}
          className="nav-letter"
          style={{ "--i": i }}
        >
          {letter}
        </span>
      ))}
    </span>
  </span>
);

export default function Home({ introFading }) {
    const navigate = useNavigate();

    const [stars] = useState(() =>
        Array.from({ length: STAR_COUNT }, () => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 4}s`,
            duration: `${2.5 + Math.random() * 3}s`,
        }))
    );

    const [raindrops] = useState(() =>
        Array.from({ length: RAIN_COUNT }, () => ({
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 2}s`,
            duration: `${0.45 + Math.random() * 0.4}s`,
            height: `${40 + Math.random() * 40}px`,
        }))
    );

    return (

        <main className="home">

            <img
                src={frankenthal}
                alt="Sigruna"
                className="home-logo"
            />

            <Navbar /> 

            <Stars
                stars={stars}
                starsVisible={true}
            />

            <div className="scene-reveal">

                <div className="night-scene">

                    <Rain
                        raindrops={raindrops}
                    />

                    <SigrunaTitle
                        key={introFading ? "show" : "hide"}
                        text="Sigruna"
                        radius={400}
                        step={20}
                    />

                </div>

            </div>

        <div
            className="door-hotspot"
            onClick={() => navigate("/projects")}
        >
            <FloatingLabel
                text="PROJECTS"
                className="floating-label"
            />
        </div>
        <div
            className="ship-hotspot"
            onClick={() => navigate("/contact")}
        >
            <FloatingLabel
                text="CONTACT"
                className="floating-label"
            />
        </div>

        <div
            className="book-hotspot"
            onClick={() => navigate("/books")}
        >
            <FloatingLabel
                text="BOOKS"
                className="floating-label"
            />
        </div>

        <div
            className="lighthouse-hotspot"
            onClick={() => navigate("/gallery")}
        >
            <FloatingLabel
                text="GALLERY"
                className="floating-label"
            />
        </div>
        </main>
    );

}