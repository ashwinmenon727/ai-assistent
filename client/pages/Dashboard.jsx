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
    --border-active: rgba(201,169,110,0.3);
    --text: #e8e8e8;
    --text-2: #999;
    --text-3: #555;
    --accent: #c9a96e;
    --accent-dim: rgba(201,169,110,0.1);
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
    font-size: 18px; font-weight: 600; color: var(--text); letter-spacing: 0.01em;
  }

  .sb-btn {
    width: 100%; display: flex; align-items: center; gap: 9px;
    padding: 9px 10px; background: transparent;
    border: 1px solid transparent; border-radius: 9px;
    color: var(--text-2); font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; cursor: pointer; transition: all 0.15s; text-align: left;
  }
  .sb-btn:hover { background: var(--surface-hover); border-color: var(--border); color: var(--text); }
  .sb-btn.active { background: var(--accent-dim); border-color: var(--user-border); color: var(--accent); }
  .sb-btn svg { opacity: 0.55; flex-shrink: 0; transition: opacity 0.15s; }
  .sb-btn:hover svg, .sb-btn.active svg { opacity: 1; }

  .sb-divider { height: 1px; background: var(--border); margin: 6px 0; }
  .sb-spacer { flex: 1; }
  .sb-section-label { font-size: 10.5px; color: var(--text-3); letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 10px 4px; }

  .sb-user {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 10px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 10px; margin-top: 6px;
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
    padding: 14px 32px;
    border-bottom: 1px solid var(--border);
    background: rgba(28,28,33,0.8);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    flex-shrink: 0;
  }

  .topbar-title {
    font-family: 'Crimson Pro', serif;
    font-size: 18px; font-weight: 600; color: var(--text);
  }

  .status-pill {
    display: flex; align-items: center; gap: 6px;
    font-size: 11.5px; padding: 4px 12px; border-radius: 20px;
    background: var(--surface); border: 1px solid var(--border); color: var(--text-3);
  }

  .live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #6fcf97; box-shadow: 0 0 6px #6fcf97;
    animation: livePulse 2.5s ease-in-out infinite;
  }
  @keyframes livePulse { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

  /* CONTENT */
  .content { flex: 1; overflow-y: auto; padding: 40px 32px; }
  .content::-webkit-scrollbar { width: 3px; }
  .content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 3px; }

  .welcome-section { margin-bottom: 40px; animation: rise 0.4s ease; }
  @keyframes rise { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }

  .welcome-h {
    font-family: 'Crimson Pro', serif;
    font-size: 34px; font-weight: 600; color: var(--text);
    margin-bottom: 6px; letter-spacing: -0.01em;
  }

  .welcome-sub { font-size: 14.5px; color: var(--text-3); line-height: 1.6; }

  /* Start chat CTA */
  .cta-card {
    background: linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.02) 100%);
    border: 1px solid var(--user-border);
    border-radius: 16px;
    padding: 28px 32px;
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    margin-bottom: 36px;
    backdrop-filter: blur(10px);
    transition: border-color 0.2s, transform 0.2s;
    animation: rise 0.5s ease 0.1s both;
  }
  .cta-card:hover { border-color: rgba(201,169,110,0.4); transform: translateY(-1px); }

  .cta-text h2 { font-family: 'Crimson Pro', serif; font-size: 22px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .cta-text p { font-size: 13.5px; color: var(--text-3); line-height: 1.6; }

  .cta-btn {
    background: linear-gradient(135deg, #c9a96e, #8a5e28);
    border: none; border-radius: 11px; color: #1c1c21;
    padding: 12px 24px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
    transition: all 0.18s; white-space: nowrap;
    box-shadow: 0 2px 12px rgba(201,169,110,0.3);
  }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,169,110,0.42); }

  /* Feature grid */
  .section-label { font-size: 11px; color: var(--text-3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px; }

  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 36px; }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px; padding: 22px 20px;
    display: flex; flex-direction: column; gap: 10px;
    backdrop-filter: blur(10px);
    transition: all 0.18s;
    animation: rise 0.5s ease both;
  }
  .card:hover { background: var(--surface-hover); border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
  .card:nth-child(1) { animation-delay: 0.15s; }
  .card:nth-child(2) { animation-delay: 0.22s; }
  .card:nth-child(3) { animation-delay: 0.29s; }

  .card-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-dim); border: 1px solid var(--user-border);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }

  .card-title { font-family: 'Crimson Pro', serif; font-size: 17px; font-weight: 600; color: var(--text); }
  .card-desc { font-size: 13px; color: var(--text-3); line-height: 1.65; flex: 1; }

  .card-link {
    font-size: 12.5px; color: var(--accent); background: none; border: none;
    cursor: pointer; padding: 0; transition: opacity 0.15s; text-align: left;
    display: flex; align-items: center; gap: 4px;
  }
  .card-link:hover { opacity: 0.75; }
`;

function Dashboard() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); navigate("/"); };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* Sidebar */}
        <div className="sidebar">
          <div className="brand">
            <img src={zionLogo} width="32" height="32" style={{ borderRadius: "9px" }} />
            <span className="brand-label">Zion.ai</span>
          </div>

          <button className="sb-btn active">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            Dashboard
          </button>

          <button className="sb-btn" onClick={() => navigate("/chat")}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            New Chat
          </button>

          <div className="sb-divider" />
          <div className="sb-section-label">Navigation</div>

          <button className="sb-btn">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /></svg>
            Settings
          </button>

          <div className="sb-spacer" />

          <div className="sb-user">
            <div className="avatar">U</div>
            <span className="user-label">My Account</span>
            <button className="logout-icon" onClick={logout} title="Logout">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <span className="topbar-title">Dashboard</span>
            <div className="status-pill"><div className="live-dot" /> All systems online</div>
          </div>

          <div className="content">
            <div className="welcome-section">
              <div className="welcome-h">Welcome back.</div>
              <p className="welcome-sub">Your AI platform is ready. Start a conversation or explore what's available.</p>
            </div>

            <div className="cta-card">
              <div className="cta-text">
                <h2>Start a new conversation</h2>
                <p>Chat with Llama 3.3 — ask questions, get help with writing, code, and more.</p>
              </div>
              <button className="cta-btn" onClick={() => navigate("/chat")}>Open Chat →</button>
            </div>

            <div className="section-label">Features</div>
            <div className="grid">
              <div className="card">
                <div className="card-icon">🧠</div>
                <div className="card-title">AI Chat</div>
                <p className="card-desc">Real-time conversation with Llama 3.3 — one of the most capable open models available.</p>
                <button className="card-link" onClick={() => navigate("/chat")}>Open chat →</button>
              </div>

              <div className="card">
                <div className="card-icon">📜</div>
                <div className="card-title">Chat History</div>
                <p className="card-desc">Every conversation is saved to your MongoDB database automatically.</p>
              </div>

              <div className="card">
                <div className="card-icon">🔐</div>
                <div className="card-title">Secure Auth</div>
                <p className="card-desc">JWT-protected routes ensure your account and messages stay private.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
