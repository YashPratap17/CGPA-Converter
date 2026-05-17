import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

// ── Data ──
const UNI_DATA = {
  cbse: { formula: g => g * 9.5, scale: 10, label: "G × 9.5" },
  vtu: { formula: g => g * 10, scale: 10, label: "G × 10" },
  du: { formula: g => g * 9.5, scale: 10, label: "G × 9.5" },
  jntu: { formula: g => g * 10, scale: 10, label: "G × 10" },
  anna: { formula: g => g * 10, scale: 10, label: "G × 10" },
  mumbai: { formula: g => (g - 0.5) * 10, scale: 10, label: "(G − 0.5) × 10" },
  pune: { formula: g => g * 10, scale: 10, label: "G × 10" },
  ipu: { formula: g => g * 10, scale: 10, label: "G × 10" },
  aktu: { formula: g => g * 10, scale: 10, label: "G × 10" },
  rtmnu: { formula: g => g * 10, scale: 10, label: "G × 10" },
  osmania: { formula: g => g * 10, scale: 10, label: "G × 10" },
  iit10: { formula: g => g * 9.5, scale: 10, label: "G × 9.5" },
  nit: { formula: g => g * 9.5, scale: 10, label: "G × 9.5" },
  generic10: { formula: g => g * 10, scale: 10, label: "G × 10" },
  generic4: { formula: g => (g / 4) * 100, scale: 4, label: "(G / 4) × 100" },
};

function getBadgeInfo(pct) {
  if (pct >= 75) return { text: "Distinction", cls: "badge-distinction", bar: "linear-gradient(90deg, #22c55e, #4ade80)" };
  if (pct >= 60) return { text: "First Class", cls: "badge-first", bar: "linear-gradient(90deg, #0ea5e9, #38bdf8)" };
  if (pct >= 50) return { text: "Second Class", cls: "badge-second", bar: "linear-gradient(90deg, #f59e0b, #fbbf24)" };
  if (pct >= 40) return { text: "Pass", cls: "badge-pass", bar: "linear-gradient(90deg, #f97316, #fb923c)" };
  return { text: "Below Pass", cls: "badge-fail", bar: "linear-gradient(90deg, #ef4444, #f87171)" };
}

function getClass(pct) {
  if (pct >= 75) return "Distinction (75%+)";
  if (pct >= 60) return "First Class (60–74%)";
  if (pct >= 50) return "Second Class (50–59%)";
  if (pct >= 40) return "Pass Class (40–49%)";
  return "Below Pass";
}

// ── Animated Background ──
function AnimatedBackground() {
  const sparkleColors = ["#22c55e", "#facc15", "#fb923c", "#38bdf8", "#a78bfa", "#4ade80"];
  const stars = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      size: Math.random() * 3 + 2,
      color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
    })), []);

  return (
    <div className="scene">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />
      <div className="grid-overlay" />
      <div className="stars">
        {stars.map(s => (
          <div
            key={s.id}
            className="star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              background: s.color,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Confetti ──
function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#22c55e", "#4ade80", "#facc15", "#fb923c", "#38bdf8", "#a78bfa", "#f472b6"];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 0.5}s`,
      rotation: Math.random() * 360,
      size: Math.random() * 6 + 4,
    }));
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: "-10px",
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ── Animated Counter ──
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return <>{display.toFixed(2)}</>;
}

// ── Result Card ──
function ResultCard({ pct }) {
  const badge = getBadgeInfo(pct);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (pct >= 60) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2800);
      return () => clearTimeout(t);
    }
  }, [pct]);

  return (
    <>
      {showConfetti && pct >= 60 && <Confetti />}
      <motion.div
        className="result-card"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <p className="result-label">Your percentage</p>
            <p className="result-value">
              <AnimatedNumber value={pct} />
              <span className="result-pct">%</span>
            </p>
          </div>
          <motion.span
            className={`badge ${badge.cls}`}
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
          >
            {badge.text}
          </motion.span>
        </div>

        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{ background: badge.bar }}
          />
        </div>

        <motion.p
          className="result-class"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {getClass(pct)}
        </motion.p>
      </motion.div>
    </>
  );
}

// ── Staggered List Item ──
const stagger = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 },
  }),
};

// ── Simple Tab ──
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
      try { pct = Function("G", "return " + customFormula)(g); formulaLabel = customFormula; } catch { }
    } else if (UNI_DATA[uni]) {
      pct = UNI_DATA[uni].formula(g);
      formulaLabel = UNI_DATA[uni].label;
    }
    if (pct !== null) pct = Math.min(100, Math.max(0, pct));
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div className="form-group" custom={0} variants={stagger} initial="hidden" animate="visible">
        <label className="form-label">University / board</label>
        <select className="form-select" value={uni} onChange={e => setUni(e.target.value)}>
          <option value="">— select your university —</option>
          <optgroup label="Boards">
            <option value="cbse">CBSE (10-point scale)</option>
          </optgroup>
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
      </motion.div>

      <AnimatePresence>
        {uni === "custom_uni" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div className="form-group">
              <label className="form-label">Your formula <span>(G = your grade)</span></label>
              <input className="form-input" placeholder="e.g. G * 9.5  or  (G - 0.5) * 10" value={customFormula} onChange={e => setCustomFormula(e.target.value)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <motion.div className="form-group" custom={1} variants={stagger} initial="hidden" animate="visible">
          <label className="form-label">Grade type</label>
          <select className="form-select" value={gradeType} onChange={e => setGradeType(e.target.value)}>
            <option value="cgpa">CGPA</option>
            <option value="sgpa">SGPA (single sem)</option>
          </select>
        </motion.div>
        <motion.div className="form-group" custom={2} variants={stagger} initial="hidden" animate="visible">
          <label className="form-label">{gradeType === "cgpa" ? "CGPA" : "SGPA"} value</label>
          <input className="form-input" type="number" min="0" max={UNI_DATA[uni]?.scale || 10} step="0.01"
            placeholder={`0 – ${UNI_DATA[uni]?.scale || 10}`} value={gradeVal}
            onChange={e => setGradeVal(e.target.value)} />
        </motion.div>
      </div>

      {formulaLabel && (
        <motion.p className="formula-hint" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          ƒ  {formulaLabel}
        </motion.p>
      )}

      <AnimatePresence mode="wait">
        {pct !== null && <ResultCard key={pct + uni} pct={pct} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ── SGPA → CGPA Tab ──
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>
        Add credits for weighted average, or leave blank for simple average.
      </p>

      <AnimatePresence>
        {sems.map((sem, i) => (
          <motion.div
            key={i}
            className="sem-row"
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="form-group">
              <label className="form-label">Sem {i + 1} SGPA</label>
              <input className="form-input" type="number" min="0" max="10" step="0.01" placeholder="e.g. 7.5"
                value={sem.sgpa} onChange={e => update(i, "sgpa", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Credits</label>
              <input className="form-input" type="number" min="0" placeholder="optional"
                value={sem.credits} onChange={e => update(i, "credits", e.target.value)} />
            </div>
            <button className="remove-btn" onClick={() => removeSem(i)}>×</button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        className="add-sem-btn"
        onClick={addSem}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        + Add semester
      </motion.button>

      <AnimatePresence mode="wait">
        {cgpa !== null && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="cgpa-summary">
              <span className="cgpa-summary-label">Cumulative CGPA</span>
              <span className="cgpa-summary-value">{cgpa.toFixed(2)}</span>
            </div>
            <ResultCard key={cgpa} pct={pct} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Custom Formula Tab ──
function CustomTab() {
  const [grade, setGrade] = useState("");
  const [formula, setFormula] = useState("");
  let pct = null;
  if (grade !== "" && formula) {
    try { pct = Math.min(100, Math.max(0, Function("G", "return " + formula)(parseFloat(grade)))); } catch { }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>
        Enter any formula your university uses. G represents your grade value.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <motion.div className="form-group" custom={0} variants={stagger} initial="hidden" animate="visible">
          <label className="form-label">CGPA / SGPA</label>
          <input className="form-input" type="number" min="0" max="10" step="0.01" placeholder="e.g. 7.5"
            value={grade} onChange={e => setGrade(e.target.value)} />
        </motion.div>
        <motion.div className="form-group" custom={1} variants={stagger} initial="hidden" animate="visible">
          <label className="form-label">Formula</label>
          <input className="form-input" placeholder="G * 9.5" value={formula} onChange={e => setFormula(e.target.value)} />
        </motion.div>
      </div>
      <p className="formula-examples">
        G * 9.5 &nbsp;·&nbsp; (G - 0.5) * 10 &nbsp;·&nbsp; G / 10 * 100
      </p>
      <AnimatePresence mode="wait">
        {pct !== null && <ResultCard key={pct + formula} pct={pct} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Tab Config ──
const TABS = [
  { id: "simple", label: "Simple" },
  { id: "sgpa", label: "SGPA → CGPA" },
  { id: "custom", label: "Custom formula" },
];

// ── Main App ──
export default function App() {
  const [tab, setTab] = useState("simple");
  const tabIndex = TABS.findIndex(t => t.id === tab);

  return (
    <>
      <AnimatedBackground />

      <div className="app-shell">
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <motion.div
              className="header-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              🎓
            </motion.div>
            <motion.h1
              className="header-title"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              CGPA → Percentage
            </motion.h1>
            <motion.p
              className="header-sub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              10+ Indian universities · SGPA aggregator · Custom formula
            </motion.p>
          </div>

          {/* Main card */}
          <motion.div
            className="main-card"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 25 }}
          >
            {/* Tab bar */}
            <div className="tab-bar">
              {/* Sliding indicator */}
              <motion.div
                className="tab-indicator"
                layout
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                style={{
                  left: `calc(${tabIndex} * (100% / 3) + 4px)`,
                  width: `calc(100% / 3 - 4px)`,
                }}
                animate={{
                  left: `calc(${tabIndex} * (100% / 3) + 4px)`,
                }}
              />
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`tab-btn ${tab === t.id ? "active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {tab === "simple" && <SimpleTab key="simple" />}
              {tab === "sgpa" && <SGPATab key="sgpa" />}
              {tab === "custom" && <CustomTab key="custom" />}
            </AnimatePresence>
          </motion.div>

          <motion.p
            className="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Free forever · Made for Indian students
          </motion.p>
        </div>
      </div>
    </>
  );
}