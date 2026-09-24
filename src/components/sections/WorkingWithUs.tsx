import { Reveal } from "@/components/Reveal";

/** The engagement terms, shown on /services and on each service's own page. */
export function WorkingWithUs() {
  return (
    <Reveal as="div" className="working-with-us-panel on-ink">
      <span className="eyebrow">Terms</span>
      <h3>Working with us</h3>
      <div className="working-with-us">
        <div>
          <b>Engagement basis</b>
          <p>Outside IR35, fixed-fee statement of work – no day-rate staffing arrangements</p>
        </div>
        <div>
          <b>Indicative first engagement</b>
          <p>Diagnostic from £1,500, fixed fee</p>
        </div>
        <div>
          <b>Knowledge transfer</b>
          <p>Documentation and upskilling are included in every engagement, not an add-on</p>
        </div>
        <div>
          <b>Location</b>
          <p>Based in Edinburgh, Scotland; works remotely across the UK and on site as required</p>
        </div>
      </div>
    </Reveal>
  );
}
