import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import zionLogo from "../src/assets/zion-logo.svg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg: #1c1c21;
    --surface: rgba(255,255,255,0.04);
    --surface-hover: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.07);
    --border-focus: rgba(201,169,110,0.35);
    --border-error: rgba(229,115,115,0.4);
    --text: #e8e8e8;
    --text-2: #999;
    --text-3: #555;
    --accent: #c9a96e;
    --accent-dim: rgba(201,169,110,0.1);
    --user-border: rgba(201,169,110,0.18);
    --red: #e57373;
    --green: #6fcf97;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .page {
    min-height: 100vh; display: flex;
    background:
      radial-gradient(ellipse 60% 50% at 15% 80%, rgba(201,169,110,0.04) 0%, transparent 100%),
      radial-gradient(ellipse 50% 60% at 85% 15%, rgba(100,80,200,0.05) 0%, transparent 100%),
      var(--bg);
  }

  /* LEFT PANEL */
  .left-panel {
    width: 420px; flex-shrink: 0; display: flex; flex-direction: column;
    justify-content: space-between; padding: 40px 44px;
    border-right: 1px solid var(--border);
    background: rgba(255,255,255,0.015);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  }

  .brand { display: flex; align-items: center; gap: 10px; }

  .brand-mark {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #c9a96e, #8a5e28);
    border-radius: 9px; display: flex; align-items: center; justify-content: center;
    font-size: 16px; box-shadow: 0 2px 12px rgba(201,169,110,0.25);
  }

  .brand-label { font-family: 'Crimson Pro', serif; font-size: 19px; font-weight: 600; color: var(--text); }

  .left-center { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }

  .tagline {
    font-family: 'Crimson Pro', serif; font-size: 38px; font-weight: 600;
    color: var(--text); line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.02em;
  }
  .tagline em { font-style: italic; color: var(--accent); }
  .tagline-sub { font-size: 14.5px; color: var(--text-3); line-height: 1.75; max-width: 280px; }

  .feature-list { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
  .feat-item { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--text-2); }
  .feat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); opacity: 0.7; flex-shrink: 0; }

  .left-footer { font-size: 12px; color: var(--text-3); }

  /* RIGHT PANEL */
  .right-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }

  .form-card { width: 100%; max-width: 380px; animation: rise 0.45s cubic-bezier(0.16,1,0.3,1); }

  @keyframes rise { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }

  .form-title { font-family: 'Crimson Pro', serif; font-size: 28px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .form-sub { font-size: 13.5px; color: var(--text-3); margin-bottom: 32px; line-height: 1.6; }

  .err-box {
    background: rgba(229,115,115,0.07); border: 1px solid rgba(229,115,115,0.2);
    border-radius: 10px; padding: 10px 14px; font-size: 13px; color: var(--red);
    margin-bottom: 20px; display: flex; align-items: flex-start; gap: 7px; line-height: 1.5;
  }

  .fields { display: flex; flex-direction: column; gap: 18px; margin-bottom: 28px; }

  .field-wrap { display: flex; flex-direction: column; gap: 7px; }

  .field-label {
    font-size: 11.5px; font-weight: 500; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--text-3); transition: color 0.15s;
  }
  .field-wrap:focus-within .field-label { color: var(--accent); }

  .field-input-wrap { position: relative; }

  .field-input {
    width: 100%; background: var(--surface); border: 1px solid var(--border);
    border-radius: 11px; padding: 13px 16px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 14.5px; outline: none;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  }
  .field-input.with-toggle { padding-right: 46px; }
  .field-input::placeholder { color: var(--text-3); }
  .field-input:focus { border-color: var(--border-focus); background: rgba(201,169,110,0.04); box-shadow: 0 0 0 3px rgba(201,169,110,0.06); }
  .field-input.error { border-color: var(--border-error); }
  .field-input.valid { border-color: rgba(111,207,151,0.35); }

  .field-hint { font-size: 11.5px; color: var(--text-3); margin-top: 2px; }
  .field-hint.error { color: var(--red); }
  .field-hint.valid { color: var(--green); }

  /* Password toggle */
  .pw-toggle {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: var(--text-3); cursor: pointer;
    padding: 4px; display: flex; align-items: center; transition: color 0.15s;
  }
  .pw-toggle:hover { color: var(--text-2); }

  /* Submit */
  .submit-btn {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #c9a96e, #8a5e28);
    border: none; border-radius: 12px; color: #1c1c21;
    font-family: 'DM Sans', sans-serif; font-size: 14.5px; font-weight: 600;
    cursor: pointer; transition: all 0.18s; margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(201,169,110,0.28);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,169,110,0.42); }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  .spinner {
    width: 14px; height: 14px; border: 2px solid rgba(28,28,33,0.3);
    border-top-color: #1c1c21; border-radius: 50%; animation: spin 0.65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .form-footer { text-align: center; font-size: 13.5px; color: var(--text-3); }
  .form-footer a { color: var(--accent); text-decoration: none; font-weight: 500; transition: opacity 0.15s; }
  .form-footer a:hover { opacity: 0.75; }

  .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
  .divider-line { flex: 1; height: 1px; background: var(--border); }
  .divider-text { font-size: 12px; color: var(--text-3); }

  @media (max-width: 720px) {
    .left-panel { display: none; }
    .right-panel { padding: 24px 20px; }
  }
`;

const isValidGmail = (email) => /^[a-zA-Z0-9._%+\-]+@gmail\.com$/.test(email.trim().toLowerCase());

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValid = isValidGmail(email);
  const emailError = emailTouched && email && !emailValid;
  const emailOk = emailTouched && emailValid;

  const login = async () => {
    setEmailTouched(true);
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if (!emailValid) { setError("Please enter a valid Gmail address (e.g. you@gmail.com)."); return; }

    setLoading(true); setError("");
    try {
      const res = await axios.post("http://localhost:5000/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => { if (e.key === "Enter") login(); };

  return (
    <>
      <style>{styles}</style>
      <div className="page">

        <div className="left-panel">

          <div className="brand">
            <img src={zionLogo} width="32" height="32" style={{ borderRadius: "9px" }} />
            <span className="brand-label">Zion.ai</span>
          </div>
          <div className="left-center">
            <div className="tagline">Your personal<br /><em>AI assistant</em><br />awaits.</div>
            <p className="tagline-sub">Powered by Llama 3.3 — ask anything, get thoughtful answers instantly.</p>
            <div className="feature-list">
              {["Real-time AI conversations", "Secure JWT authentication", "Persistent chat history", "Powered by Groq API"].map(f => (
                <div key={f} className="feat-item"><div className="feat-dot" />{f}</div>
              ))}
            </div>
          </div>
          <div className="left-footer">© 2025 AI SaaS · Built with React + Node</div>
        </div>

        <div className="right-panel">
          <div className="form-card">
            <div className="form-title">Sign in</div>
            <p className="form-sub">Welcome back. Enter your Gmail to continue.</p>

            {error && <div className="err-box">⚠ {error}</div>}

            <div className="fields">
              <div className="field-wrap">
                <label className="field-label">Gmail Address</label>
                <div className="field-input-wrap">
                  <input
                    className={`field-input${emailError ? " error" : emailOk ? " valid" : ""}`}
                    type="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    onKeyDown={onKey}
                  />
                </div>
                {emailError && <span className="field-hint error">Must be a valid @gmail.com address</span>}
                {emailOk && <span className="field-hint valid">✓ Valid Gmail</span>}
              </div>

              <div className="field-wrap">
                <label className="field-label">Password</label>
                <div className="field-input-wrap">
                  <input
                    className="field-input with-toggle"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={onKey}
                  />
                  <button className="pw-toggle" onClick={() => setShowPw(p => !p)} type="button" tabIndex={-1}>
                    {showPw
                      ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
              </div>
            </div>

            <button className="submit-btn" onClick={login} disabled={loading}>
              {loading ? <><div className="spinner" /> Signing in…</> : "Continue →"}
            </button>

            <div className="divider"><div className="divider-line" /><span className="divider-text">or</span><div className="divider-line" /></div>

            <p className="form-footer">Don't have an account? <a href="/register">Create one</a></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
