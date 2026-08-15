"use client";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <a href="#top" className="brand">
          <span className="dot" />K&nbsp;REAL&nbsp;SOLUTIONS{" "}
          <small>Audit&nbsp;·&nbsp;Analytics&nbsp;·&nbsp;AI</small>
        </a>
        <div className={`nav-links${open ? " open" : ""}`} id="navlinks">
          <a href="#start" onClick={() => setOpen(false)}>
            Start here
          </a>
          <a href="#services" onClick={() => setOpen(false)}>
            Services
          </a>
          <a href="#work" onClick={() => setOpen(false)}>
            Selected work
          </a>
          <a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>
            Book a conversation
          </a>
        </div>
        <button
          className="burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
