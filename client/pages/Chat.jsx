import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ── Inline Zion.ai Logo ── */
const ZionLogo = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={size} height={size}>
    <defs>
      <linearGradient id="zBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#1c1c21" }} />
        <stop offset="100%" style={{ stopColor: "#2a2a32" }} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="13" fill="url(#zBg)" />
    <ellipse cx="24" cy="24" rx="17" ry="8" fill="none" stroke="#c9a96e" strokeWidth="1" strokeDasharray="3.5 2.5" opacity="0.5" transform="rotate(-30 24 24)" />
    <ellipse cx="24" cy="24" rx="17" ry="8" fill="none" stroke="#c9a96e" strokeWidth="1" strokeDasharray="3.5 2.5" opacity="0.4" transform="rotate(30 24 24)" />
    <g opacity="0.6">
      <line x1="24" y1="24" x2="10" y2="14" stroke="#c9a96e" strokeWidth="0.8" />
      <line x1="24" y1="24" x2="38" y2="14" stroke="#c9a96e" strokeWidth="0.8" />
      <line x1="24" y1="24" x2="38" y2="34" stroke="#c9a96e" strokeWidth="0.8" />
      <line x1="24" y1="24" x2="10" y2="34" stroke="#c9a96e" strokeWidth="0.8" />
      <line x1="24" y1="24" x2="24" y2="8" stroke="#c9a96e" strokeWidth="0.8" />
      <line x1="24" y1="24" x2="24" y2="40" stroke="#c9a96e" strokeWidth="0.8" />
    </g>
    <circle cx="10" cy="14" r="1.8" fill="#e8c98a" opacity="0.7" />
    <circle cx="38" cy="14" r="1.8" fill="#e8c98a" opacity="0.7" />
    <circle cx="38" cy="34" r="1.8" fill="#e8c98a" opacity="0.7" />
    <circle cx="10" cy="34" r="1.8" fill="#e8c98a" opacity="0.7" />
    <circle cx="24" cy="8" r="1.8" fill="#e8c98a" opacity="0.85" />
    <circle cx="24" cy="40" r="1.5" fill="#e8c98a" opacity="0.5" />
    <circle cx="24" cy="24" r="5.5" fill="#1c1c21" stroke="#c9a96e" strokeWidth="1.2" />
    <circle cx="24" cy="24" r="3.2" fill="#c9a96e" />
    <circle cx="22.5" cy="22.5" r="1" fill="#fff" opacity="0.35" />
  </svg>
);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg: #1c1c21;
    --sidebar: rgba(255,255,255,0.025);
    --surface: rgba(255,255,255,0.04);
    --surface-hover: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.07);
    --border-active: rgba(201,169,110,0.3);
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

  /* SIDEBAR */
  .sidebar {
    width: 256px; flex-shrink: 0; display: flex; flex-direction: column;
    padding: 14px 10px; background: var(--sidebar);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border-right: 1px solid var(--border);
  }

  .brand {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px 18px; border-bottom: 1px solid var(--border); margin-bottom: 10px;
  }

  .brand-label {
    font-family: 'Crimson Pro', serif; font-size: 18px; font-weight: 600;
    color: var(--text); letter-spacing: 0.01em;
  }

  .sb-btn {
    width: 100%; display: flex; align-items: center; gap: 9px;
    padding: 9px 10px; background: transparent; border: 1px solid transparent;
    border-radius: 9px; color: var(--text-2); font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; cursor: pointer; transition: all 0.15s; text-align: left;
  }
  .sb-btn:hover { background: var(--surface-hover); border-color: var(--border); color: var(--text); }
  .sb-btn.primary { background: var(--accent-dim); border-color: var(--user-border); color: var(--accent); }
  .sb-btn.primary:hover { background: rgba(201,169,110,0.15); }
  .sb-btn svg { opacity: 0.55; flex-shrink: 0; transition: opacity 0.15s; }
  .sb-btn:hover svg, .sb-btn.primary svg { opacity: 1; }

  .sb-divider { height: 1px; background: var(--border); margin: 6px 0; }
  .sb-spacer { flex: 1; }

  .sb-section-label {
    font-size: 10.5px; color: var(--text-3); letter-spacing: 0.1em;
    text-transform: uppercase; padding: 8px 10px 4px;
  }

  .recent-item {
    display: flex; align-items: center; gap: 8px; padding: 8px 10px;
    border-radius: 8px; font-size: 13px; color: var(--text-2);
    cursor: pointer; transition: all 0.15s; border: 1px solid transparent; overflow: hidden;
  }
  .recent-item:hover { background: var(--surface-hover); border-color: var(--border); color: var(--text); }
  .recent-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }

  .sb-user {
    display: flex; align-items: center; gap: 9px; padding: 9px 10px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; margin-top: 6px;
  }

  .avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white; flex-shrink: 0;
  }

  .user-label { font-size: 12px; color: var(--text-3); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .logout-icon {
    background: none; border: none; color: var(--text-3);
    cursor: pointer; padding: 3px; border-radius: 5px; display: flex; transition: color 0.15s;
  }
  .logout-icon:hover { color: var(--red); }

  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 28px; border-bottom: 1px solid var(--border);
    background: rgba(28,28,33,0.8); backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px); flex-shrink: 0;
  }
  .topbar-left { display: flex; align-items: center; gap: 10px; }

  .live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #6fcf97; box-shadow: 0 0 7px #6fcf97;
    animation: livePulse 2.5s ease-in-out infinite;
  }
  @keyframes livePulse { 0%,100%{opacity:1;} 50%{opacity:0.25;} }

  .topbar-title { font-family: 'Crimson Pro', serif; font-size: 17px; font-weight: 600; color: var(--text); }

  .model-tag {
    font-size: 11px; padding: 3px 10px; border-radius: 20px;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text-3); letter-spacing: 0.03em;
  }

  /* MESSAGES */
  .msgs { flex: 1; overflow-y: auto; padding: 28px 0 8px; display: flex; flex-direction: column; }
  .msgs::-webkit-scrollbar { width: 3px; }
  .msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 3px; }

  .msg-wrap {
    max-width: 780px; width: 100%; margin: 0 auto;
    padding: 4px 28px; animation: rise 0.22s ease;
  }
  @keyframes rise { from{opacity:0;transform:translateY(7px);} to{opacity:1;transform:translateY(0);} }

  /* Empty state */
  .empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 14px; padding: 40px; animation: fadeIn 0.5s ease;
  }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }

  .empty-icon {
    width: 72px; height: 72px;
    background: linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.03));
    border: 1px solid var(--user-border); border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(8px); box-shadow: 0 4px 24px rgba(201,169,110,0.1);
  }

  .empty-h { font-family: 'Crimson Pro', serif; font-size: 28px; font-weight: 600; color: var(--text); }
  .empty-p { font-size: 14px; color: var(--text-3); text-align: center; max-width: 300px; line-height: 1.7; }

  .chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 6px; }
  .chip {
    padding: 7px 15px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; font-size: 13px; color: var(--text-2); cursor: pointer; transition: all 0.15s;
  }
  .chip:hover { background: var(--surface-hover); border-color: var(--border-active); color: var(--text); }

  /* User bubble */
  .row-user { display: flex; justify-content: flex-end; margin-bottom: 2px; flex-direction: column; align-items: flex-end; gap: 6px; }
  .bub-user {
    background: var(--user-bg); border: 1px solid var(--user-border);
    backdrop-filter: blur(8px); border-radius: 18px 18px 4px 18px;
    padding: 11px 17px; font-size: 14.5px; line-height: 1.65;
    color: var(--text); max-width: 70%; white-space: pre-wrap; word-break: break-word;
  }

  /* File preview */
  .file-preview {
    display: flex; align-items: center; gap: 8px;
    background: rgba(201,169,110,0.06); border: 1px solid var(--user-border);
    border-radius: 12px; padding: 8px 13px; font-size: 13px; color: var(--text-2); max-width: 70%;
  }
  .file-preview-icon { font-size: 18px; flex-shrink: 0; }
  .file-preview-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .file-preview img { max-width: 220px; max-height: 160px; border-radius: 10px; object-fit: cover; display: block; }

  /* AI row */
  .row-ai { display: flex; gap: 13px; align-items: flex-start; margin-top: 6px; }
  .ai-av {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #c9a96e, #8a5e28);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 3px; overflow: hidden;
    box-shadow: 0 2px 8px rgba(201,169,110,0.18);
  }
  .bub-ai {
    font-size: 14.5px; line-height: 1.8; color: #d0d0d0;
    max-width: 85%; white-space: pre-wrap; word-break: break-word; padding-top: 2px;
  }

  /* Typing dots */
  .typing { display: flex; gap: 5px; align-items: center; padding: 6px 0; }
  .tdot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); opacity: 0.4; animation: tdot 1.3s ease-in-out infinite;
  }
  .tdot:nth-child(2){animation-delay:0.2s;} .tdot:nth-child(3){animation-delay:0.4s;}
  @keyframes tdot { 0%,80%,100%{transform:scale(0.8);opacity:0.4;} 40%{transform:scale(1.15);opacity:1;} }

  /* Input zone */
  .input-zone {
    padding: 14px 28px 22px; background: rgba(28,28,33,0.7); backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px); border-top: 1px solid var(--border); flex-shrink: 0;
  }

  .input-shell {
    max-width: 780px; margin: 0 auto; position: relative;
    background: rgba(255,255,255,0.035); border: 1px solid var(--border);
    border-radius: 15px; backdrop-filter: blur(10px); transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-shell:focus-within {
    border-color: var(--border-active);
    box-shadow: 0 0 0 3px rgba(201,169,110,0.05), 0 6px 30px rgba(0,0,0,0.18);
  }

  .file-bar { display: flex; align-items: center; gap: 8px; padding: 8px 14px 0; font-size: 13px; color: var(--text-2); }
  .file-bar-name {
    flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    background: rgba(201,169,110,0.07); border: 1px solid var(--user-border);
    border-radius: 8px; padding: 3px 10px; font-size: 12px; color: var(--accent);
  }
  .file-bar-remove {
    background: none; border: none; color: var(--text-3); cursor: pointer;
    font-size: 16px; padding: 0 4px; line-height: 1; transition: color 0.15s;
  }
  .file-bar-remove:hover { color: var(--red); }

  .input-row { display: flex; align-items: flex-end; }

  .attach-btn {
    background: none; border: none; color: var(--text-3); cursor: pointer;
    padding: 15px 4px 15px 14px; display: flex; align-items: center;
    transition: color 0.15s; flex-shrink: 0;
  }
  .attach-btn:hover { color: var(--accent); }
  .attach-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .msg-input {
    flex: 1; background: transparent; border: none; outline: none; resize: none;
    padding: 15px 10px; color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; line-height: 1.6; min-height: 52px; max-height: 200px;
  }
  .msg-input::placeholder { color: var(--text-3); }

  .go-btn {
    margin: 9px 10px 9px 0; width: 34px; height: 34px; border-radius: 9px;
    background: linear-gradient(135deg, #c9a96e, #8a5e28);
    border: none; color: #1c1c21; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s; box-shadow: 0 2px 8px rgba(201,169,110,0.28);
    flex-shrink: 0; align-self: flex-end;
  }
  .go-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(201,169,110,0.45); }
  .go-btn:disabled { background: rgba(255,255,255,0.07); color: var(--text-3); cursor: not-allowed; box-shadow: none; }

  .input-meta { text-align: center; font-size: 11px; color: var(--text-3); margin-top: 9px; max-width: 780px; margin-left: auto; margin-right: auto; }

  .err-bar {
    max-width: 780px; margin: 0 auto 10px; padding: 9px 15px;
    background: rgba(229,115,115,0.07); border: 1px solid rgba(229,115,115,0.18);
    border-radius: 9px; font-size: 13px; color: var(--red); display: flex; align-items: center; gap: 7px;
  }
`;

const getFileIcon = (type) => {
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("audio/")) return "🎵";
  if (type.startsWith("video/")) return "🎬";
  if (type === "application/pdf") return "📄";
  return "📎";
};

const ACCEPTED = "image/*,audio/*,video/*,application/pdf";

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const taRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    e.target.value = "";
  };

  const removeFile = () => { setSelectedFile(null); setPreviewUrl(null); };

  const send = async (text) => {
    const msg = (text || message).trim();
    if ((!msg && !selectedFile) || loading) return;

    const fileToSend = selectedFile;
    const previewForChat = previewUrl;
    const fileNameForChat = selectedFile?.name;
    const fileTypeForChat = selectedFile?.type;

    setMessage(""); setSelectedFile(null); setPreviewUrl(null);
    setError(""); setLoading(true);
    if (taRef.current) taRef.current.style.height = "auto";

    setChat(prev => [...prev, {
      message: msg,
      file: fileToSend ? { name: fileNameForChat, type: fileTypeForChat, preview: previewForChat } : null,
      reply: null
    }]);

    try {
      const token = localStorage.getItem("token");
      let res;
      if (fileToSend) {
        const formData = new FormData();
        if (msg) formData.append("message", msg);
        formData.append("file", fileToSend);
        res = await axios.post("http://localhost:5000/chat/upload", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("http://localhost:5000/chat", { message: msg }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
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

  const suggestions = ["Explain a concept simply", "Help me write something", "Debug my code", "Brainstorm ideas"];
  const canSend = !loading && (message.trim() || selectedFile);

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* ── Sidebar ── */}
        <div className="sidebar">
          <div className="brand">
            <ZionLogo size={32} />
            <span className="brand-label">Zion.ai</span>
          </div>

          <button className="sb-btn primary" onClick={() => { setChat([]); setError(""); removeFile(); }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            New conversation
          </button>

          <button className="sb-btn" onClick={() => navigate("/dashboard")}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            Dashboard
          </button>

          <div className="sb-divider" />
          <div className="sb-section-label">Recent</div>

          {chat.length > 0 ? (
            <div className="recent-item">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span className="recent-text">{chat[0]?.message?.slice(0, 30) || chat[0]?.file?.name}…</span>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--text-3)", padding: "4px 10px" }}>No recent chats</div>
          )}

          <div className="sb-spacer" />

          <div className="sb-user">
            <div className="avatar">U</div>
            <span className="user-label">Logged in</span>
            <button className="logout-icon" onClick={() => { localStorage.removeItem("token"); navigate("/"); }} title="Logout">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            </button>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <div className="live-dot" />
              <span className="topbar-title">Zion.ai</span>
            </div>
            <span className="model-tag">llama-3.3-70b-versatile</span>
          </div>

          <div className="msgs">
            {chat.length === 0 && !loading && (
              <div className="empty">
                <div className="empty-icon">
                  <ZionLogo size={42} />
                </div>
                <div className="empty-h">How can I help you?</div>
                <p className="empty-p">Powered by Zion.ai · Ask me anything or attach a file below.</p>
                <div className="chips">
                  {suggestions.map(s => <div key={s} className="chip" onClick={() => send(s)}>{s}</div>)}
                </div>
              </div>
            )}

            {chat.map((c, i) => (
              <div className="msg-wrap" key={i}>
                <div className="row-user">
                  {c.file && (
                    <div className="file-preview">
                      {c.file.type?.startsWith("image/") && c.file.preview ? (
                        <img src={c.file.preview} alt={c.file.name} />
                      ) : (
                        <>
                          <span className="file-preview-icon">{getFileIcon(c.file.type || "")}</span>
                          <span className="file-preview-name">{c.file.name}</span>
                        </>
                      )}
                    </div>
                  )}
                  {c.message && <div className="bub-user">{c.message}</div>}
                </div>

                {c.reply && (
                  <div className="row-ai">
                    <div className="ai-av"><ZionLogo size={22} /></div>
                    <div className="bub-ai">{c.reply}</div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="msg-wrap">
                <div className="row-ai">
                  <div className="ai-av"><ZionLogo size={22} /></div>
                  <div className="bub-ai">
                    <div className="typing"><div className="tdot" /><div className="tdot" /><div className="tdot" /></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="input-zone">
            {error && <div className="err-bar">⚠ {error}</div>}

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <div className="input-shell">
              {selectedFile && (
                <div className="file-bar">
                  <span>{getFileIcon(selectedFile.type)}</span>
                  <span className="file-bar-name">{selectedFile.name}</span>
                  <button className="file-bar-remove" onClick={removeFile} title="Remove file">×</button>
                </div>
              )}

              <div className="input-row">
                <button className="attach-btn" onClick={() => fileInputRef.current?.click()} disabled={loading} title="Attach file">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>

                <textarea
                  ref={taRef}
                  className="msg-input"
                  placeholder={selectedFile ? "Add a message about your file…" : "Message Zion.ai…"}
                  value={message}
                  onChange={onInput}
                  onKeyDown={onKey}
                  disabled={loading}
                  rows={1}
                />

                <button className="go-btn" onClick={() => send()} disabled={!canSend}>➤</button>
              </div>
            </div>

            <div className="input-meta">Enter to send · Shift+Enter for new line · 📎 to attach files</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
