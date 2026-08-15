export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap">
        <span className="brand">
          <span className="dot" /> K Real Solutions Ltd
        </span>
        <span>Internal audit · data analytics · AI &nbsp;·&nbsp; Registered in Scotland</span>
        <span>© {year} K Real Solutions Ltd</span>
      </div>
    </footer>
  );
}
