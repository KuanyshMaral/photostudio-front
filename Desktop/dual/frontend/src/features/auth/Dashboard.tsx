import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { token, logout } = useAuth();

  return (
    <div className="dashboard-root">
      <div className="dashboard-card">
        <div className="dashboard-hero">Welcome to MWork PhotoStudio</div>
        <h1 className="dashboard-title">You're signed in</h1>
        <p className="dashboard-sub">Session token: <code className="token">{token}</code></p>
        <div style={{ marginTop: 20 }}>
          <button className="auth-button" onClick={logout}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
