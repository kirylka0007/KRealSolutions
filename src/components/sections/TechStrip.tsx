import { Reveal } from "@/components/Reveal";

const TECH = ["Microsoft Fabric", "Power BI", "Power Automate", "Alteryx", "Azure OpenAI", "Azure Databricks", "Python", "PM4Py", "RAG pipelines"];

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
