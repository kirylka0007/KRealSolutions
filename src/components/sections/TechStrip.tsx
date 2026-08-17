import { Reveal } from "@/components/Reveal";

const TECH = ["Microsoft Fabric", "Power BI", "Power Automate", "Alteryx", "OpenAI", "Anthropic", "Gemini", "Azure Databricks", "Snowflake", "Python", "RAG pipelines"];

export function TechStrip() {
  return (
    <div className="tech">
      <Reveal as="div" className="wrap">
        <span className="lab">Stack</span>
        {TECH.map((t) => (
          <span className="t" key={t}>
            {t}
          </span>
        ))}
      </Reveal>
    </div>
  );
}
