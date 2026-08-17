"use client";
import { useState } from "react";
import Link from "next/link";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <Link href="/#top" className="brand">
          <span className="dot" />K&nbsp;REAL&nbsp;SOLUTIONS{" "}
          <small>Audit&nbsp;·&nbsp;Analytics&nbsp;·&nbsp;AI</small>
        </Link>
        <button
          className="burger"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="navlinks"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-links${open ? " open" : ""}`} id="navlinks">
          <Link href="/#start" onClick={() => setOpen(false)}>
            Find your fit
          </Link>
          <Link href="/services" onClick={() => setOpen(false)}>
            Services
          </Link>
          <Link href="/who-we-are" onClick={() => setOpen(false)}>
            Who we are
          </Link>
          <Link href="/health-check" onClick={() => setOpen(false)}>
            Health check
          </Link>
          <Link href="/#contact" className="nav-cta" onClick={() => setOpen(false)}>
            Book a conversation
          </Link>
        </div>
      </div>
    </nav>
  );
}
