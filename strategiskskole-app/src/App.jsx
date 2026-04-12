import { useState, useRef, useEffect } from "react";
import { C, STEPS, ROLLER, getKortForStep } from "./data.js";

const API_URL = "https://strategi-chat.strategiskskole.workers.dev/api/chat";

// ── ROLLE-VÆLGER ──────────────────────────────────────────
function RollePicker({ onSelect }) {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ minHeight: "100vh", minHeight: "100dvh", background: `linear-gradient(170deg, ${C.navy} 0%, ${C.blue} 50%, ${C.light} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 24, padding: "48px 32px", maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(26,58,92,0.3)" }}>
        <div style={{ fontSize: 12, color: C.blue, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 12 }}>Strategiskskole.dk</div>
        <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: 24, color: C.navy, margin: "0 0 6px", fontWeight: 700, lineHeight: 1.3 }}>
          Tirsdag kl. 10-modellen<sup style={{ fontSize: 12 }}>®</sup>
        </h1>
        <p style={{ color: C.gray, fontSize: 14, margin: "0 0 40px", lineHeight: 1.5 }}>
          Strategi, der kan mærkes i praksis
        </p>
        <p style={{ color: C.navy, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Vælg din rolle:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ROLLER.map((r, i) => (
            <button key={r.key} onClick={() => onSelect(r.key)}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              onTouchStart={() => setHover(i)} onTouchEnd={() => setTimeout(() => setHover(null), 200)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: hover === i ? C.navy : "white", color: hover === i ? "white" : C.navy, border: `1.5px solid ${C.navy}20`, borderRadius: 14, cursor: "pointer", transition: "all 0.2s", textAlign: "left", WebkitTapHighlightColor: "transparent" }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{r.label}</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{r.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <p style={{ marginTop: 36, color: "#c0c0c0", fontSize: 11 }}>Strategi, der kan mærkes i praksis</p>
      </div>
    </div>
  );
}

// ── TRIN TABS ─────────────────────────────────────────────
function TrinTabs({ aktivt, setAktivt, beskedCount }) {
  const tabsRef = useRef(null);
  useEffect(() => {
    const el = tabsRef.current?.children[aktivt];
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [aktivt]);

  return (
    <div ref={tabsRef} className="tabs-scroll" style={{ display: "flex", gap: 1, padding: "0 8px", overflowX: "auto", background: "white", borderBottom: `1px solid ${C.light}`, flexShrink: 0 }}>
      {STEPS.map((s, i) => {
        const er = aktivt === i;
        const done = (beskedCount[s.id] || 0) >= 4;
        const isH = s.type === "human";
        return (
          <button key={s.id} onClick={() => setAktivt(i)} style={{
            padding: "10px 8px", border: "none", cursor: "pointer",
            background: "transparent", borderBottom: er ? `3px solid ${s.farve}` : "3px solid transparent",
            color: er ? s.farve : C.gray, fontWeight: er ? 700 : 500, fontSize: 10,
            whiteSpace: "nowrap", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 3,
            fontStyle: isH ? "italic" : "normal", opacity: er ? 1 : isH ? 0.65 : 0.8,
            WebkitTapHighlightColor: "transparent", flexShrink: 0,
          }}>
            {isH ? (
              <span style={{ width: 16, height: 16, borderRadius: "50%", fontSize: 9, display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? C.gold : er ? `${C.gold}30` : "#f0ebe4", color: done ? "white" : C.gold }}>♡</span>
            ) : (
              <span style={{ width: 16, height: 16, borderRadius: "50%", fontSize: 9, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? s.farve : er ? s.farve : "#e5e7eb", color: done || er ? "white" : C.gray }}>
                {s.type === "aabning" ? "→" : s.type === "afslutning" ? "←" : done ? "✓" : s.nr}
              </span>
            )}
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ── PROCESKORT DRAWER ─────────────────────────────────────
function KortDrawer({ open, onClose, kort, step }) {
  if (!kort) return null;
  const isH = step.type === "human";
  const accent = isH ? C.gold : C.blue;
  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 90 }} />}
      <div style={{ position: "fixed", top: 0, right: open ? 0 : "-100%", width: "min(360px, 90vw)", height: "100vh", height: "100dvh", background: isH ? C.warm : "white", zIndex: 100, boxShadow: open ? "-8px 0 30px rgba(0,0,0,0.15)" : "none", transition: "right 0.3s ease", overflowY: "auto", padding: open ? "24px 20px" : 0, WebkitOverflowScrolling: "touch" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            {isH ? "Det menneskelige rum" : step.type === "aabning" ? "Åbningskort" : step.type === "afslutning" ? "Afslutningskort" : `Proceskort — Trin ${step.nr}`}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.gray, padding: 8, WebkitTapHighlightColor: "transparent" }}>✕</button>
        </div>
        <div style={{ fontFamily: "'Merriweather', serif", fontSize: 16, color: C.navy, fontWeight: 700, lineHeight: 1.4, marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${accent}` }}>
          {kort.forside}
        </div>
        <Sec label="Åbning" items={kort.aabning} color={accent} />
        {kort.skaerpelse && <Sec label="Skærpelse" items={kort.skaerpelse} color={accent} />}
        {kort.perspektiv && <Sec label="Perspektiv" items={kort.perspektiv} color={accent} />}
        {kort.ramme && <Sec label="Ramme" items={kort.ramme} color={accent} />}
        <div style={{ background: isH ? "rgba(255,255,255,0.6)" : C.light, borderRadius: 12, padding: 16, marginTop: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Erkendelse</div>
          <div style={{ fontSize: 13, color: C.navy, fontStyle: "italic", lineHeight: 1.5 }}>{kort.erkendelse}</div>
        </div>
      </div>
    </>
  );
}

function Sec({ label, items, color }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>{label}</div>
      {items.map((q, i) => <div key={i} style={{ fontSize: 13, color: C.gray, lineHeight: 1.6, marginBottom: 7, paddingLeft: 12, borderLeft: `2px solid ${color}40` }}>{q}</div>)}
    </div>
  );
}

// ── CHAT BOBLE ────────────────────────────────────────────
function Boble({ rolle, content }) {
  const ai = rolle === "assistant";
  return (
    <div className="bubble-enter" style={{ display: "flex", justifyContent: ai ? "flex-start" : "flex-end", marginBottom: 12 }}>
      <div style={{ maxWidth: "85%", padding: "12px 16px", borderRadius: ai ? "18px 18px 18px 4px" : "18px 18px 4px 18px", background: ai ? "white" : C.navy, color: ai ? "#333" : "white", fontSize: 14, lineHeight: 1.7, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{content}</div>
    </div>
  );
}

// ── THINKING INDICATOR ────────────────────────────────────
function Thinking() {
  return (
    <div style={{ display: "flex", marginBottom: 12 }}>
      <div style={{ background: "white", padding: "14px 22px", borderRadius: "18px 18px 18px 4px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div className="thinking-dots" style={{ display: "flex", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.blue, display: "inline-block" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.blue, display: "inline-block" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.blue, display: "inline-block" }} />
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const [rolle, setRolle] = useState(null);
  const [aktivt, setAktivt] = useState(0);
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState({});
  const [input, setInput] = useState("");
  const [kortOpen, setKortOpen] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chats, loading]);

  if (!rolle) return <RollePicker onSelect={setRolle} />;

  const step = STEPS[aktivt];
  const key = `${rolle}-${step.id}`;
  const msgs = chats[key] || [];
  const beskedCount = {};
  STEPS.forEach(s => { beskedCount[s.id] = (chats[`${rolle}-${s.id}`] || []).length; });
  const rolleInfo = ROLLER.find(r => r.key === rolle);
  const kort = getKortForStep(step, rolle);
  const isHuman = step.type === "human";

  const getDemoReply = (msg, msgCount) => {
    const k = kort;
    if (!k) return "Kan du fortælle mere?";
    if (msgCount <= 1) {
      const q = k.skaerpelse?.[0] || k.ramme?.[0] || "Hvad ser du, når du kigger på din situation?";
      return `Det er et godt udgangspunkt.\n\n${isHuman ? "Lad mig spørge ind til det, der fylder:" : "Lad mig skærpe det:"} ${q}\n\nTag dig tid.`;
    }
    if (msgCount <= 3) {
      const q = k.skaerpelse?.[1] || k.perspektiv?.[0] || "Hvad kræver det af dig?";
      return `Tak for den refleksion.\n\n${q}\n\nHvad dukker op, når du tænker over det?`;
    }
    if (msgCount <= 5) {
      const q = k.perspektiv?.[1] || k.perspektiv?.[0] || "Hvad vil du gøre anderledes?";
      return `Nu tegner der sig et billede.\n\n${q}\n\nFormuler det som en konkret handling.`;
    }
    return `Du har arbejdet dig godt ind i dette.\n\nDin erkendelse: ${k.erkendelse}\n\nDu er klar til næste trin, eller du kan blive og uddybe.`;
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    const cur = chats[key] || [];
    setChats(p => ({ ...p, [key]: [...(p[key] || []), { role: "user", content: msg }] }));
    setLoading(true);

    let reply;
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, source: "forloeb", session_id: sessions[key] || null, trin: step.nr, rolle, mode: "forberedelse" }),
      });
      const data = await resp.json();
      reply = data.reply || data.answer;
      if (data.session_id) setSessions(p => ({ ...p, [key]: data.session_id }));
    } catch {
      // Fallback to demo mode
    }
    if (!reply) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
      reply = getDemoReply(msg, cur.length);
    }
    setChats(p => ({ ...p, [key]: [...(p[key] || []), { role: "assistant", content: reply }] }));
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", background: isHuman ? C.warm : C.bg, height: "100vh", height: "100dvh", display: "flex", flexDirection: "column", transition: "background 0.3s" }}>

      {/* HEADER */}
      <header className="app-header" style={{ background: C.navy, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "white", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Merriweather', serif", fontSize: 15, fontWeight: 700 }}>Tirsdag kl. 10<sup style={{ fontSize: 8 }}>®</sup></div>
          <div style={{ fontSize: 10, opacity: 0.55 }}>Strategi, der kan mærkes i praksis</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>{rolleInfo.icon} {rolleInfo.label}</span>
          <button onClick={() => setRolle(null)} style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "white", padding: "6px 12px", borderRadius: 8, fontSize: 11, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>Skift</button>
        </div>
      </header>

      {/* TRIN TABS */}
      <TrinTabs aktivt={aktivt} setAktivt={setAktivt} beskedCount={beskedCount} />

      {/* STEP HEADER */}
      <div style={{ background: isHuman ? `linear-gradient(135deg, ${C.gold}, ${C.gold}dd)` : `linear-gradient(135deg, ${step.farve}, ${C.navy})`, padding: "14px 16px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.8, marginBottom: 2 }}>
            {isHuman ? `Det menneskelige rum — ${step.navn}` : step.type === "aabning" ? "Åbning" : step.type === "afslutning" ? "Afslutning" : `Trin ${step.nr} — ${step.navn}`}
          </div>
          <div style={{ fontFamily: "'Merriweather', serif", fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{step.spørgsmål}</div>
        </div>
        {kort && (
          <button onClick={() => setKortOpen(true)} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 12px", borderRadius: 10, fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}>
            {isHuman ? "♡ Kort" : "Kort"}
          </button>
        )}
      </div>

      {/* CHAT AREA */}
      <div ref={scrollRef} className="chat-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: isHuman ? `${C.gold}20` : C.light, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12, color: isHuman ? C.gold : C.navy }}>
              {isHuman ? "♡" : step.type === "aabning" ? "→" : step.type === "afslutning" ? "←" : step.nr}
            </div>
            <div style={{ fontFamily: "'Merriweather', serif", fontSize: 16, color: C.navy, fontWeight: 700, marginBottom: 8 }}>{step.navn}</div>
            <div style={{ fontSize: 13, color: C.gray, lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>{step.kontekst}</div>
            <div style={{ marginTop: 16, fontSize: 12, color: "#bbb" }}>Skriv dit første svar for at begynde.</div>
          </div>
        )}
        {msgs.map((m, i) => <Boble key={i} rolle={m.role} content={m.content} />)}
        {loading && <Thinking />}
      </div>

      {/* INPUT */}
      <div className="app-input" style={{ padding: "10px 12px 14px", background: "white", borderTop: `1px solid ${C.light}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Skriv din refleksion..."
          style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: "1.5px solid #d1d5db", fontSize: 16, outline: "none", fontFamily: "'Open Sans', sans-serif", WebkitAppearance: "none" }} />
        <button onClick={send} disabled={loading || !input.trim()} style={{ background: input.trim() && !loading ? (isHuman ? C.gold : C.navy) : "#d1d5db", color: "white", border: "none", borderRadius: 12, padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: input.trim() && !loading ? "pointer" : "default", transition: "all 0.2s", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}>Send</button>
      </div>

      {/* KORT DRAWER */}
      <KortDrawer open={kortOpen} onClose={() => setKortOpen(false)} kort={kort} step={step} />
    </div>
  );
}
