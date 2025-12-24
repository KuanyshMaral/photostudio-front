import LoginForm from "./features/auth/LoginForm";
import Dashboard from "./features/auth/Dashboard";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token } = useAuth();

  if (!token) {
    return <LoginForm />;
  }

  return <Dashboard />;
}

export default App;
