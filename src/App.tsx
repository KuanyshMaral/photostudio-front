import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import Dashboard from "./features/auth/Dashboard";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={token ? <Dashboard /> : <LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
