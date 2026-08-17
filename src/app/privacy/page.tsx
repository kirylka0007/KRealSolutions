import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <section className="sec">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Privacy</span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(1.9rem,3.6vw,2.6rem)" }}>Privacy policy</h1>
          <p style={{ color: "var(--text-soft)", marginTop: 8 }}>Last updated: 17 August 2026</p>

          <div style={{ marginTop: 40, display: "grid", gap: 32, color: "var(--text-soft)", fontSize: "1.02rem", lineHeight: 1.7 }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 10 }}>Who we are</h2>
              <p>
                K Real Solutions Ltd (company number SC891005, registered in Scotland at [registered office address – to be added]) operates this website. For anything relating to this policy, contact us at{" "}
                <a href="mailto:info@krealsolutions.co.uk" style={{ color: "var(--assure-deep)" }}>
                  info@krealsolutions.co.uk
                </a>
                .
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 10 }}>What we collect</h2>
              <p>
                If you use our enquiry form, we collect your name, email address, organisation, role, the topic you&apos;re interested in, and any message you write. If you use our health-check quiz, we collect your name, email address, industry, team size, current data &amp; analytics maturity, budget appetite, primary aim, and any optional pain-point description you provide. We also briefly log IP addresses for spam and abuse prevention on both forms; this is not retained beyond that operational purpose.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 10 }}>Why we collect it</h2>
              <p>
                We use this information to respond to your enquiry, to provide the health-check result you asked for, and, only if you separately opt in, to send you further updates. Our basis for processing is legitimate interest in responding to enquiries you&apos;ve initiated, and contractual necessity in delivering the specific result or reply you requested.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 10 }}>Who we share it with</h2>
              <p>
                We use Supabase to store submitted form data and Resend to send emails. Both act as data processors on our behalf, only for the purposes above — we don&apos;t sell or share your data with anyone else.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 10 }}>How long we keep it</h2>
              <p>
                We retain your information for as long as necessary to respond to your enquiry and for a reasonable follow-up period, typically no more than 24 months, after which it&apos;s deleted unless you ask us to delete it sooner
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 10 }}>Your rights</h2>
              <p>
                You can ask us to access, correct, delete, restrict, or export your data, or object to how we use it, at any time – email{" "}
                <a href="mailto:info@krealsolutions.co.uk" style={{ color: "var(--assure-deep)" }}>
                  info@krealsolutions.co.uk
                </a>{" "}
                and we&apos;ll act on it promptly
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 10 }}>Cookies</h2>
              <p>We don&apos;t use tracking or advertising cookies on this site</p>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 10 }}>Changes to this policy</h2>
              <p>We may update this page from time to time. The date at the top shows the most recent revision.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
