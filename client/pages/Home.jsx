import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import zionLogo from "../src/assets/zion-logo.svg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg: #1c1c21;
    --sidebar: rgba(255,255,255,0.025);
    --surface: rgba(255,255,255,0.04);
    --surface-hover: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.07);
    --border-focus: rgba(201,169,110,0.35);
    --text: #e8e8e8;
    --text-2: #999;
    --text-3: #555;
    --accent: #c9a96e;
    --accent-dim: rgba(201,169,110,0.1);
    --user-bg: rgba(201,169,110,0.09);
    --user-border: rgba(201,169,110,0.18);
    --red: #e57373;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    display: flex; height: 100vh;
    background:
      radial-gradient(ellipse 70% 50% at 5% 90%, rgba(201,169,110,0.03) 0%, transparent 100%),
      radial-gradient(ellipse 50% 60% at 95% 5%, rgba(100,80,200,0.04) 0%, transparent 100%),
      var(--bg);
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 256px; flex-shrink: 0;
    display: flex; flex-direction: column;
    padding: 14px 10px;
    background: var(--sidebar);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-right: 1px solid var(--border);
  }

  .brand {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px 18px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 10px;
  }

  .brand-mark {
    width: 30px; height: 30px;
    background: linear-gradient(135deg, #c9a96e, #8a5e28);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 15px; box-shadow: 0 2px 10px rgba(201,169,110,0.22);
  }

  .brand-label {
    font-family: 'Crimson Pro', serif;
    font-size: 18px; font-weight: 600; color: var(--text);
  }

  .sb-btn {
    width: 100%; display: flex; align-items: center; gap: 9px;
    padding: 9px 10px; background: transparent;
    border: 1px solid transparent; border-radius: 9px;
    color: var(--text-2); font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; cursor: pointer; transition: all 0.15s; text-align: left;
  }
  .sb-btn:hover { background: var(--surface-hover); border-color: var(--border); color: var(--text); }
  .sb-btn.primary { background: var(--accent-dim); border-color: var(--user-border); color: var(--accent); }
  .sb-btn svg { opacity: 0.55; flex-shrink: 0; }
  .sb-btn:hover svg, .sb-btn.primary svg { opacity: 1; }

  .sb-divider { height: 1px; background: var(--border); margin: 6px 0; }
  .sb-spacer { flex: 1; }
  .sb-label { font-size: 10.5px; color: var(--text-3); letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 10px 4px; }

  .sb-auth-btns { display: flex; flex-direction: column; gap: 6px; padding: 4px 0; }

  .sb-sign-in {
    width: 100%; padding: 9px 10px;
    background: linear-gradient(135deg, #c9a96e, #8a5e28);
    border: none; border-radius: 9px;
    color: #1c1c21; font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    transition: all 0.15s; text-align: left;
    box-shadow: 0 2px 8px rgba(201,169,110,0.2);
  }
  .sb-sign-in:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(201,169,110,0.35); }

  /* ── MAIN ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 28px;
    border-bottom: 1px solid var(--border);
    background: rgba(28,28,33,0.8);
    backdrop-filter: blur(14px);
    flex-shrink: 0;
  }

  .topbar-left { display: flex; align-items: center; gap: 10px; }

  .live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #6fcf97; box-shadow: 0 0 7px #6fcf97;
    animation: livePulse 2.5s ease-in-out infinite;
  }
  @keyframes livePulse { 0%,100%{opacity:1;} 50%{opacity:0.25;} }

  .topbar-title { font-family: 'Crimson Pro', serif; font-size: 17px; font-weight: 600; color: var(--text); }

  .topbar-right { display: flex; align-items: center; gap: 8px; }

  .top-btn {
    padding: 6px 14px; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
  }
  .top-btn.ghost { background: transparent; border: 1px solid var(--border); color: var(--text-2); }
  .top-btn.ghost:hover { background: var(--surface-hover); color: var(--text); }
  .top-btn.filled { background: linear-gradient(135deg, #c9a96e, #8a5e28); border: none; color: #1c1c21; font-weight: 600; box-shadow: 0 2px 8px rgba(201,169,110,0.2); }
  .top-btn.filled:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(201,169,110,0.35); }

  .model-tag { font-size: 11px; padding: 3px 10px; border-radius: 20px; background: var(--surface); border: 1px solid var(--border); color: var(--text-3); }

  /* ── MESSAGES ── */
  .msgs { flex: 1; overflow-y: auto; padding: 28px 0 8px; display: flex; flex-direction: column; }
  .msgs::-webkit-scrollbar { width: 3px; }
  .msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 3px; }

  .msg-wrap { max-width: 780px; width: 100%; margin: 0 auto; padding: 4px 28px; animation: rise 0.22s ease; }
  @keyframes rise { from{opacity:0;transform:translateY(7px);} to{opacity:1;transform:translateY(0);} }

  /* Empty */
  .empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 40px; animation: fadeIn 0.5s ease; }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }

  .empty-icon {
    width: 60px; height: 60px;
    background: linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.03));
    border: 1px solid var(--user-border);
    border-radius: 18px; display: flex; align-items: center; justify-content: center;
    font-size: 28px; backdrop-filter: blur(8px);
  }

  .empty-h { font-family: 'Crimson Pro', serif; font-size: 28px; font-weight: 600; color: var(--text); }
  .empty-p { font-size: 14px; color: var(--text-3); text-align: center; max-width: 320px; line-height: 1.7; }

  .guest-note {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 10px;
    background: var(--accent-dim); border: 1px solid var(--user-border);
    font-size: 13px; color: var(--accent); margin-top: 4px;
  }

  .chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 6px; }
  .chip { padding: 7px 15px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; font-size: 13px; color: var(--text-2); cursor: pointer; transition: all 0.15s; }
  .chip:hover { background: var(--surface-hover); border-color: var(--border-focus); color: var(--text); }

  /* Bubbles */
  .row-user { display: flex; justify-content: flex-end; margin-bottom: 2px; }
  .bub-user { background: var(--user-bg); border: 1px solid var(--user-border); backdrop-filter: blur(8px); border-radius: 18px 18px 4px 18px; padding: 11px 17px; font-size: 14.5px; line-height: 1.65; color: var(--text); max-width: 70%; white-space: pre-wrap; word-break: break-word; }

  .row-ai { display: flex; gap: 13px; align-items: flex-start; margin-top: 6px; }
  .ai-av { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #c9a96e, #8a5e28); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; margin-top: 3px; box-shadow: 0 2px 8px rgba(201,169,110,0.18); }
  .bub-ai { font-size: 14.5px; line-height: 1.8; color: #d0d0d0; max-width: 85%; white-space: pre-wrap; word-break: break-word; padding-top: 2px; }

  .typing { display: flex; gap: 5px; align-items: center; padding: 6px 0; }
  .tdot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); opacity: 0.4; animation: tdot 1.3s ease-in-out infinite; }
  .tdot:nth-child(2){animation-delay:0.2s;} .tdot:nth-child(3){animation-delay:0.4s;}
  @keyframes tdot { 0%,80%,100%{transform:scale(0.8);opacity:0.4;} 40%{transform:scale(1.15);opacity:1;} }

  /* ── INPUT ── */
  .input-zone { padding: 14px 28px 22px; background: rgba(28,28,33,0.7); backdrop-filter: blur(16px); border-top: 1px solid var(--border); flex-shrink: 0; }

  .input-shell {
    max-width: 780px; margin: 0 auto; position: relative;
    background: rgba(255,255,255,0.035); border: 1px solid var(--border);
    border-radius: 15px; backdrop-filter: blur(10px);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-shell:focus-within { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(201,169,110,0.05), 0 6px 30px rgba(0,0,0,0.18); }

  .input-row-inner { display: flex; align-items: flex-end; padding: 6px 8px 6px 6px; gap: 6px; }

  .attach-btn {
    width: 36px; height: 36px; flex-shrink: 0;
    background: transparent; border: 1px solid var(--border);
    border-radius: 9px; color: var(--text-3);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; align-self: flex-end; margin-bottom: 1px;
  }
  .attach-btn:hover { background: var(--surface-hover); border-color: var(--border-focus); color: var(--accent); }

  .msg-input {
    flex: 1; background: transparent; border: none; outline: none; resize: none;
    padding: 9px 10px; color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; line-height: 1.6; min-height: 38px; max-height: 200px;
  }
  .msg-input::placeholder { color: var(--text-3); }

  .go-btn {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    background: linear-gradient(135deg, #c9a96e, #8a5e28);
    border: none; color: #1c1c21; font-size: 14px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.18s; box-shadow: 0 2px 8px rgba(201,169,110,0.28);
    align-self: flex-end; margin-bottom: 1px;
  }
  .go-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(201,169,110,0.45); }
  .go-btn:disabled { background: rgba(255,255,255,0.07); color: var(--text-3); cursor: not-allowed; box-shadow: none; }

  .input-meta { text-align: center; font-size: 11px; color: var(--text-3); margin-top: 9px; max-width: 780px; margin-left: auto; margin-right: auto; }

  .err-bar { max-width: 780px; margin: 0 auto 10px; padding: 9px 15px; background: rgba(229,115,115,0.07); border: 1px solid rgba(229,115,115,0.18); border-radius: 9px; font-size: 13px; color: var(--red); display: flex; align-items: center; gap: 7px; }

  /* ── LOGIN MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(10,10,14,0.75);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: overlayIn 0.2s ease;
  }
  @keyframes overlayIn { from{opacity:0;} to{opacity:1;} }

  .modal {
    width: 100%; max-width: 420px;
    background: rgba(28,28,33,0.95);
    border: 1px solid rgba(201,169,110,0.2);
    border-radius: 22px; padding: 36px 36px 32px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
    backdrop-filter: blur(24px);
    animation: modalIn 0.28s cubic-bezier(0.16,1,0.3,1);
    position: relative;
  }
  @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(10px);} to{opacity:1;transform:scale(1) translateY(0);} }

  .modal-close {
    position: absolute; top: 14px; right: 14px;
    width: 28px; height: 28px; border-radius: 7px;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text-3); cursor: pointer; display: flex;
    align-items: center; justify-content: center; font-size: 16px;
    transition: all 0.15s;
  }
  .modal-close:hover { background: var(--surface-hover); color: var(--text); }

  .modal-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.05));
    border: 1px solid var(--user-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 18px;
  }

  .modal-title { font-family: 'Crimson Pro', serif; font-size: 24px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
  .modal-sub { font-size: 13.5px; color: var(--text-3); line-height: 1.65; margin-bottom: 26px; }

  .modal-perks { display: flex; flex-direction: column; gap: 9px; margin-bottom: 26px; }
  .perk { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--text-2); }
  .perk-icon { width: 26px; height: 26px; border-radius: 7px; background: var(--accent-dim); border: 1px solid var(--user-border); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }

  .modal-btns { display: flex; flex-direction: column; gap: 9px; }

  .modal-btn-primary {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #c9a96e, #8a5e28);
    border: none; border-radius: 11px; color: #1c1c21;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
    box-shadow: 0 2px 12px rgba(201,169,110,0.28);
  }
  .modal-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,169,110,0.42); }

  .modal-btn-ghost {
    width: 100%; padding: 12px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 11px; color: var(--text-2);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    cursor: pointer; transition: all 0.15s;
  }
  .modal-btn-ghost:hover { background: var(--surface-hover); color: var(--text); border-color: rgba(255,255,255,0.12); }

  .modal-divider { display: flex; align-items: center; gap: 10px; }
  .modal-divider-line { flex: 1; height: 1px; background: var(--border); }
  .modal-divider-text { font-size: 11.5px; color: var(--text-3); }
`;

function Home() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const bottomRef = useRef(null);
    const taRef = useRef(null);
    const isLoggedIn = !!localStorage.getItem("token");

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, loading]);

    const send = async (text) => {
        const msg = (text || message).trim();
        if (!msg || loading) return;
        setMessage("");
        setError("");
        setLoading(true);
        if (taRef.current) taRef.current.style.height = "auto";
        setChat(prev => [...prev, { message: msg, reply: null }]);

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.post("http://localhost:5000/chat", { message: msg }, { headers });
            setChat(prev => prev.map((c, i) => i === prev.length - 1 ? { ...c, reply: res.data.reply } : c));
        } catch {
            setError("Something went wrong. Please try again.");
            setChat(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
    const onInput = (e) => {
        setMessage(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
    };

    const handleAttach = () => {
        if (isLoggedIn) {
            navigate("/chat"); // full chat with upload in authenticated version
        } else {
            setShowModal(true);
        }
    };

    const suggestions = ["Explain a concept simply", "Help me write something", "Debug my code", "Brainstorm ideas"];

    return (
        <>
            <style>{styles}</style>

            {/* Login modal */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        <div className="modal-icon">🔒</div>
                        <div className="modal-title">Sign in to attach files</div>
                        <p className="modal-sub">Create a free account to upload images and documents and get AI-powered analysis.</p>

                        <div className="modal-perks">
                            <div className="perk"><div className="perk-icon">🖼️</div> Upload and analyze images</div>
                            <div className="perk"><div className="perk-icon">📄</div> Chat with your documents</div>
                            <div className="perk"><div className="perk-icon">💾</div> Save your chat history</div>
                            <div className="perk"><div className="perk-icon">⚡</div> Faster, priority responses</div>
                        </div>

                        <div className="modal-btns">
                            <button className="modal-btn-primary" onClick={() => navigate("/register")}>
                                Create free account →
                            </button>
                            <div className="modal-divider">
                                <div className="modal-divider-line" />
                                <span className="modal-divider-text">already have one?</span>
                                <div className="modal-divider-line" />
                            </div>
                            <button className="modal-btn-ghost" onClick={() => navigate("/login")}>
                                Sign in
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="app">
                {/* Sidebar */}
                <div className="sidebar">



                    <div className="brand">
                        <img src={zionLogo} width="32" height="32" style={{ borderRadius: "9px" }} />
                        <span className="brand-label">Zion.ai</span>
                    </div>

                    <button className="sb-btn primary" onClick={() => { setChat([]); setError(""); }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                        New conversation
                    </button>

                    <div className="sb-divider" />

                    <div className="sb-label">Recent</div>
                    {chat.length > 0 ? (
                        <div className="sb-btn" style={{ fontSize: 13, color: "var(--text-2)" }}>
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat[0]?.message?.slice(0, 28)}…</span>
                        </div>
                    ) : (
                        <div style={{ fontSize: 12, color: "var(--text-3)", padding: "4px 10px" }}>No recent chats</div>
                    )}

                    <div className="sb-spacer" />

                    {/* Auth buttons at bottom */}
                    {isLoggedIn ? (
                        <button className="sb-btn" onClick={() => navigate("/dashboard")}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                            Dashboard
                        </button>
                    ) : (
                        <div className="sb-auth-btns">
                            <div className="sb-label" style={{ paddingTop: 0 }}>Account</div>
                            <button className="sb-sign-in" onClick={() => navigate("/login")}>Sign in →</button>
                            <button className="sb-btn" onClick={() => navigate("/register")}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                                Register
                            </button>
                        </div>
                    )}
                </div>

                {/* Main */}
                <div className="main">
                    <div className="topbar">
                        <div className="topbar-left">
                            <div className="live-dot" />
                            <span className="topbar-title">AI Chat</span>
                        </div>
                        <div className="topbar-right">
                            <span className="model-tag">llama-3.3-70b-versatile</span>
                            {!isLoggedIn && (
                                <>
                                    <button className="top-btn ghost" onClick={() => navigate("/login")}>Sign in</button>
                                    <button className="top-btn filled" onClick={() => navigate("/register")}>Get started</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="msgs">
                        {chat.length === 0 && !loading && (
                            <div className="empty">
                                <div className="empty-icon">🤖</div>
                                <div className="empty-h">How can I help you?</div>
                                <p className="empty-p">Ask me anything — no account needed for text chat.</p>
                                {!isLoggedIn && (
                                    <div className="guest-note">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                        Sign in to attach images & documents
                                    </div>
                                )}
                                <div className="chips">
                                    {suggestions.map(s => <div key={s} className="chip" onClick={() => send(s)}>{s}</div>)}
                                </div>
                            </div>
                        )}

                        {chat.map((c, i) => (
                            <div className="msg-wrap" key={i}>
                                <div className="row-user"><div className="bub-user">{c.message}</div></div>
                                {c.reply && (
                                    <div className="row-ai">
                                        <div className="ai-av">🤖</div>
                                        <div className="bub-ai">{c.reply}</div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="msg-wrap">
                                <div className="row-ai">
                                    <div className="ai-av">🤖</div>
                                    <div className="bub-ai"><div className="typing"><div className="tdot" /><div className="tdot" /><div className="tdot" /></div></div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="input-zone">
                        {error && <div className="err-bar">⚠ {error}</div>}
                        <div className="input-shell">
                            <div className="input-row-inner">
                                {/* Attach button — triggers login modal if guest */}
                                <button className="attach-btn" onClick={handleAttach} title={isLoggedIn ? "Attach file" : "Sign in to attach"}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                    </svg>
                                </button>

                                <textarea
                                    ref={taRef}
                                    className="msg-input"
                                    placeholder="Message AI SaaS… (no sign-in needed)"
                                    value={message}
                                    onChange={onInput}
                                    onKeyDown={onKey}
                                    disabled={loading}
                                    rows={1}
                                />

                                <button className="go-btn" onClick={() => send()} disabled={loading || !message.trim()}>➤</button>
                            </div>
                        </div>
                        <div className="input-meta">
                            {isLoggedIn ? "Enter to send · Shift+Enter for new line" : "Chatting as guest · Sign in to unlock image & document uploads"}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
