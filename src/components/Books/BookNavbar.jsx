import { Link, NavLink } from "react-router-dom";
import frankenthalLogo from "../../assets/frankenthal.png";
import "./BookNavbar.css";

export default function BookNavbar() {
  return (
    <header className="book-navbar">
      <Link to="/books" className="book-navbar-logo">
        <img
          src={frankenthalLogo}
          alt="Frankenthal"
          className="book-navbar-logo-image"
        />
      </Link>

      <nav className="book-navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/playpen">Playpen</NavLink>
      </nav>
    </header>
  );
}