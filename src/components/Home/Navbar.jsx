import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useMemo } from "react";

import "./Navbar.css";

const links = [
    { label: "HOME", path: "/" },
    { label: "PROJECTS", path: "/projects" },
    { label: "GALLERY", path: "/gallery" },
    { label: "CONTACT", path: "/contact" },
    { label: "BOOKS", path: "/books" },
    { label: "PLAYPEN", path: "/playpen" },
];

export default function Navbar() {

    const [open, setOpen] = useState(true);

    const location = useLocation();

    const linkRefs = useRef({});

    const navRef = useRef(null);

    const [indicator, setIndicator] = useState({

        top: 0,
        left: 0,
        width: 0,
        height: 0,
        opacity: 0,

    });

    useLayoutEffect(() => {

        const active = linkRefs.current[location.pathname];

        if (!active || !navRef.current) return;

        const navRect = navRef.current.getBoundingClientRect();

        const rect = active.getBoundingClientRect();

        const text = active.querySelector(".nav-text");

        const textRect = text.getBoundingClientRect();

    }, [location.pathname, open]);

        const sparkles = useMemo(
        () =>
            Array.from({ length: 25 }, () => ({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 0.8 + Math.random() * 2,
                delay: Math.random() * 6,
                duration: 4 + Math.random() * 5,
            })),
        []
    );

    return (

        <>

            <button

                className={`diamond-button ${open ? "open" : ""}`}

                onClick={() => setOpen(prev => !prev)}

                aria-label="Toggle Menu"

            >

                <span className="diamond-core" />

            </button>

                <nav className={`navbar ${open ? "open" : ""}`}>
                
                {links.map((link, index) => (

                    <NavLink

                        key={link.path}

                        to={link.path}

                        ref={node => {

                            if (node)

                                linkRefs.current[link.path] = node;

                        }}

                        className={({ isActive }) =>

                            `navbar-link ${

                                isActive

                                    ? "active"

                                    : ""

                            }`

                        }

                        style={{

                            "--delay": `${index * 90}ms`,

                        }}

                    >
<span className="nav-bg">

    <span className="nav-bg-blur" />
    <span className="nav-bg-haze" />

    {sparkles.map((sparkle, i) => (
        <span
            key={i}
            className="sparkle"
            style={{
                "--x": `${sparkle.x}%`,
                "--y": `${sparkle.y}%`,
                "--size": `${sparkle.size}px`,
                "--delay": `${sparkle.delay}s`,
                "--duration": `${sparkle.duration}s`,
            }}
        />
    ))}

    <span className="nav-bg-edge" />

</span>

                    <span className="nav-text">
                        {link.label.split("").map((letter, i) => (
                            <span
                                key={i}
                                className="nav-letter"
                                style={{ "--i": i }}
                            >
                                {letter}
                            </span>
                        ))}
                    </span>

                    </NavLink>

                ))}

            </nav>

        </>

    );

}