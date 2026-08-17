import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap">
        <span className="brand">
          <span className="dot" /> K Real Solutions Ltd
        </span>
        <nav className="footer-links">
          <Link href="/services">Services</Link>
          <Link href="/who-we-are">Who we are</Link>
          <Link href="/health-check">Health check</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <span>Internal audit · data analytics · AI &nbsp;·&nbsp; Registered in Scotland, company no. SC891005</span>
        <span>© {year} K Real Solutions Ltd</span>
      </div>
    </footer>
  );
}
