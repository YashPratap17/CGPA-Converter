import { useState, useEffect } from "react";

const UNI_DATA = {
  vtu:      { formula: g => g * 10,         scale: 10, label: "G × 10" },
  du:       { formula: g => g * 9.5,        scale: 10, label: "G × 9.5" },
  jntu:     { formula: g => g * 10,         scale: 10, label: "G × 10" },
  anna:     { formula: g => g * 10,         scale: 10, label: "G × 10" },
  mumbai:   { formula: g => (g - 0.5) * 10, scale: 10, label: "(G − 0.5) × 10" },
  pune:     { formula: g => g * 10,         scale: 10, label: "G × 10" },
  ipu:      { formula: g => g * 10,         scale: 10, label: "G × 10" },
  aktu:     { formula: g => g * 10,         scale: 10, label: "G × 10" },
  rtmnu:    { formula: g => g * 10,         scale: 10, label: "G × 10" },
  osmania:  { formula: g => g * 10,         scale: 10, label: "G × 10" },
  iit10:    { formula: g => g * 9.5,        scale: 10, label: "G × 9.5" },
  nit:      { formula: g => g * 9.5,        scale: 10, label: "G × 9.5" },
  generic10:{ formula: g => g * 10,         scale: 10, label: "G × 10" },
  generic4: { formula: g => (g / 4) * 100,  scale: 4,  label: "(G / 4) × 100" },
};

function getBadgeInfo(pct) {
  if (pct >= 75) return { text: "Distinction", color: "#16a34a", bg: "#dcfce7", bar: "#22c55e" };
  if (pct >= 60) return { text: "First Class", color: "#0369a1", bg: "#e0f2fe", bar: "#38bdf8" };
  if (pct >= 50) return { text: "Second Class", color: "#b45309", bg: "#fef3c7", bar: "#fbbf24" };
  if (pct >= 40) return { text: "Pass", color: "#b45309", bg: "#fef3c7", bar: "#fbbf24" };
  return { text: "Below Pass", color: "#b91c1c", bg: "#fee2e2", bar: "#f87171" };
}

function getClass(pct) {
  if (pct >= 75) return "Distinction (75%+)";
  if (pct >= 60) return "First Class (60–74%)";
  if (pct >= 50) return "Second Class (50–59%)";
  if (pct >= 40) return "Pass Class (40–49%)";
  return "Below Pass";
}

function AnimatedBar({ pct, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8, overflow: "hidden", marginTop: 10 }}>
      <div style={{
        height: "100%", borderRadius: 99,
        width: width + "%",
        background: color,
        transition: "width 0.7s cubic-bezier(0.34,1.56,0.64,1)",
      }} />
    </div>
  );
}

function ResultCard({ pct }) {
  const badge = getBadgeInfo(pct);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 30); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      background: "#fafbff",
      border: "1.5px solid #e0e7ff",
      borderRadius: 16,
      padding: "1.4rem",
      marginTop: 20,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <p style={{ fontSize: 11, color: "#a5b4fc", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Your percentage</p>
          <p style={{ fontSize: 44, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>
            {pct.toFixed(2)}<span style={{ fontSize: 22, fontWeight: 500, color: "#94a3b8" }}>%</span>
          </p>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, padding: "5px 14px",
          borderRadius: 99, background: badge.bg, color: badge.color,
          letterSpacing: "0.02em", marginTop: 4,
        }}>{badge.text}</span>
      </div>
      <AnimatedBar pct={pct} color={badge.bar} />
      <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 10 }}>{getClass(pct)}</p>
    </div>
  );
}

const inp = {
  group: { marginBottom: 16 },
  label: { fontSize: 13, color: "#64748b", display: "block", marginBottom: 6, fontWeight: 500 },
  input: {
    width: "100%", fontSize: 15, padding: "10px 14px",
    border: "1.5px solid #e2e8f0", borderRadius: 10,
    outline: "none", boxSizing: "border-box",
    background: "#fff", color: "#0f172a",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  select: {
    width: "100%", fontSize: 15, padding: "10px 14px",
    border: "1.5px solid #e2e8f0", borderRadius: 10,
    outline: "none", background: "#fff", color: "#0f172a",
    boxSizing: "border-box", cursor: "pointer",
  },
};

function SimpleTab() {
  const [uni, setUni] = useState("");
  const [gradeType, setGradeType] = useState("cgpa");
  const [gradeVal, setGradeVal] = useState("");
  const [customFormula, setCustomFormula] = useState("");

  let pct = null;
  let formulaLabel = null;

  if (uni && gradeVal !== "" && !isNaN(parseFloat(gradeVal))) {
    const g = parseFloat(gradeVal);
    if (uni === "custom_uni" && customFormula) {
      try { pct = Function("G", "return " + customFormula)(g); formulaLabel = customFormula; } catch {}
    } else if (UNI_DATA[uni]) {
      pct = UNI_DATA[uni].formula(g);
      formulaLabel = UNI_DATA[uni].label;
    }
    if (pct !== null) pct = Math.min(100, Math.max(0, pct));
  }

  return (
    <div>
      <div style={inp.group}>
        <label style={inp.label}>University / board</label>
        <select style={inp.select} value={uni} onChange={e => setUni(e.target.value)}>
          <option value="">— select your university —</option>
          <optgroup label="Central universities">
            <option value="vtu">VTU (Visvesvaraya Technological)</option>
            <option value="du">Delhi University</option>
            <option value="jntu">JNTU</option>
            <option value="anna">Anna University</option>
            <option value="mumbai">University of Mumbai</option>
            <option value="pune">Savitribai Phule Pune University</option>
            <option value="ipu">GGSIPU</option>
            <option value="aktu">AKTU (Dr. APJ Abdul Kalam)</option>
            <option value="rtmnu">RTMNU Nagpur</option>
            <option value="osmania">Osmania University</option>
          </optgroup>
          <optgroup label="IITs / NITs">
            <option value="iit10">IIT (10-point scale)</option>
            <option value="nit">NIT (general)</option>
          </optgroup>
          <optgroup label="Other">
            <option value="generic10">Generic 10-point scale</option>
            <option value="generic4">Generic 4-point scale (US style)</option>
            <option value="custom_uni">My university isn't listed</option>
          </optgroup>
        </select>
      </div>

      {uni === "custom_uni" && (
        <div style={inp.group}>
          <label style={inp.label}>Your formula <span style={{ color: "#c4b5fd", fontWeight: 400 }}>(G = your grade)</span></label>
          <input style={inp.input} placeholder="e.g. G * 9.5  or  (G - 0.5) * 10" value={customFormula} onChange={e => setCustomFormula(e.target.value)} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={inp.group}>
          <label style={inp.label}>Grade type</label>
          <select style={inp.select} value={gradeType} onChange={e => setGradeType(e.target.value)}>
            <option value="cgpa">CGPA</option>
            <option value="sgpa">SGPA (single sem)</option>
          </select>
        </div>
        <div style={inp.group}>
          <label style={inp.label}>{gradeType === "cgpa" ? "CGPA" : "SGPA"} value</label>
          <input style={inp.input} type="number" min="0" max={UNI_DATA[uni]?.scale || 10} step="0.01"
            placeholder={`0 – ${UNI_DATA[uni]?.scale || 10}`} value={gradeVal}
            onChange={e => setGradeVal(e.target.value)} />
        </div>
      </div>

      {formulaLabel && (
        <p style={{ fontSize: 12, color: "#a5b4fc", fontFamily: "monospace", marginTop: -8, marginBottom: 4 }}>
          ƒ  {formulaLabel}
        </p>
      )}

      {pct !== null && <ResultCard key={pct + uni} pct={pct} />}
    </div>
  );
}

function SGPATab() {
  const [sems, setSems] = useState([{ sgpa: "", credits: "" }, { sgpa: "", credits: "" }]);
  const addSem = () => setSems([...sems, { sgpa: "", credits: "" }]);
  const removeSem = i => sems.length > 1 && setSems(sems.filter((_, idx) => idx !== i));
  const update = (i, f, v) => { const n = [...sems]; n[i][f] = v; setSems(n); };

  const valid = sems.filter(s => s.sgpa !== "" && !isNaN(parseFloat(s.sgpa)));
  const hasCredits = valid.length > 0 && valid.every(s => s.credits !== "" && !isNaN(parseFloat(s.credits)) && parseFloat(s.credits) > 0);
  let cgpa = null;
  if (valid.length > 0) {
    cgpa = hasCredits
      ? valid.reduce((a, s) => a + parseFloat(s.sgpa) * parseFloat(s.credits), 0) / valid.reduce((a, s) => a + parseFloat(s.credits), 0)
      : valid.reduce((a, s) => a + parseFloat(s.sgpa), 0) / valid.length;
  }
  const pct = cgpa !== null ? Math.min(100, cgpa * 9.5) : null;

  return (
    <div>
      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 18 }}>Add credits for weighted average, or leave blank for simple average.</p>
      {sems.map((sem, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 32px", gap: 10, alignItems: "end", marginBottom: 10 }}>
          <div style={inp.group}>
            <label style={inp.label}>Sem {i + 1} SGPA</label>
            <input style={inp.input} type="number" min="0" max="10" step="0.01" placeholder="e.g. 7.5"
              value={sem.sgpa} onChange={e => update(i, "sgpa", e.target.value)} />
          </div>
          <div style={inp.group}>
            <label style={inp.label}>Credits</label>
            <input style={inp.input} type="number" min="0" placeholder="optional"
              value={sem.credits} onChange={e => update(i, "credits", e.target.value)} />
          </div>
          <button onClick={() => removeSem(i)}
            style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: 22, paddingBottom: 16 }}>×</button>
        </div>
      ))}
      <button onClick={addSem} style={{
        width: "100%", padding: "9px 0", border: "1.5px dashed #c7d2fe",
        borderRadius: 10, background: "none", color: "#818cf8",
        fontSize: 13, cursor: "pointer", marginTop: 2, fontWeight: 500,
      }}>+ Add semester</button>

      {cgpa !== null && (
        <>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 16px", marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Cumulative CGPA</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#6366f1" }}>{cgpa.toFixed(2)}</span>
          </div>
          <ResultCard key={cgpa} pct={pct} />
        </>
      )}
    </div>
  );
}

function CustomTab() {
  const [grade, setGrade] = useState("");
  const [formula, setFormula] = useState("");
  let pct = null;
  if (grade !== "" && formula) {
    try { pct = Math.min(100, Math.max(0, Function("G", "return " + formula)(parseFloat(grade)))); } catch {}
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 18 }}>Enter any formula your university uses. G represents your grade value.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={inp.group}>
          <label style={inp.label}>CGPA / SGPA</label>
          <input style={inp.input} type="number" min="0" max="10" step="0.01" placeholder="e.g. 7.5"
            value={grade} onChange={e => setGrade(e.target.value)} />
        </div>
        <div style={inp.group}>
          <label style={inp.label}>Formula</label>
          <input style={inp.input} placeholder="G * 9.5" value={formula} onChange={e => setFormula(e.target.value)} />
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: -8, fontFamily: "monospace" }}>
        G * 9.5 &nbsp;·&nbsp; (G - 0.5) * 10 &nbsp;·&nbsp; G / 10 * 100
      </p>
      {pct !== null && <ResultCard key={pct + formula} pct={pct} />}
    </div>
  );
}

const TABS = [
  { id: "simple", label: "Simple" },
  { id: "sgpa",   label: "SGPA → CGPA" },
  { id: "custom", label: "Custom formula" },
];

export default function App() {
  const [tab, setTab] = useState("simple");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eef2ff 0%, #faf5ff 50%, #f0fdf4 100%)",
      padding: "2.5rem 1rem 4rem",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: transparent; }
        input:focus, select:focus {
          border-color: #818cf8 !important;
          box-shadow: 0 0 0 3px rgba(129,140,248,0.15) !important;
        }
        button { transition: all 0.15s ease; }
        button:active { transform: scale(0.97); }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
      `}</style>

      <div style={{ maxWidth: 540, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            marginBottom: 14, fontSize: 26,
            boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
          }}>🎓</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 6, letterSpacing: "-0.02em" }}>
            CGPA → Percentage
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>
            10+ Indian universities · SGPA aggregator · Custom formula
          </p>
        </div>

        {/* Main card */}
        <div style={{
          background: "#fff",
          borderRadius: 22,
          border: "1px solid #e8eaf6",
          padding: "1.75rem",
          boxShadow: "0 8px 32px rgba(99,102,241,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        }}>
          {/* Tab switcher */}
          <div style={{
            display: "flex", gap: 4,
            background: "#f1f5f9",
            borderRadius: 12, padding: 4, marginBottom: 24,
          }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 9, border: "none",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                background: tab === t.id ? "#fff" : "transparent",
                color: tab === t.id ? "#6366f1" : "#94a3b8",
                boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.09)" : "none",
              }}>{t.label}</button>
            ))}
          </div>

          {tab === "simple" && <SimpleTab />}
          {tab === "sgpa"   && <SGPATab />}
          {tab === "custom" && <CustomTab />}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#c7d2fe", marginTop: 24 }}>
          Free forever · Made for Indian students
        </p>
      </div>
    </div>
  );
}