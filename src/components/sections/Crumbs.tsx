import Link from "next/link";

export interface Crumb {
  name: string;
  /** Omitted for the current page, which is the last crumb. */
  href?: string;
}

/** The trail back up the site, shown at the top of each service and case page. */
export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        {items.map((c) =>
          c.href ? (
            <li key={c.name}>
              <Link href={c.href}>{c.name}</Link>
            </li>
          ) : (
            <li key={c.name} aria-current="page">
              {c.name}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
