import { useEffect, useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import Products from "./components/Products/Products";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";

const url = "http://localhost:5173";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-950">
      {showLogin && (
        <LoginPopUp
          url={url}
          setShowLogin={setShowLogin}
          setToken={setToken}
        />
      )}
      <NavBar token={token} onLoginClick={() => setShowLogin(true)} onLogout={handleLogout} />
      <div className="flex-1 overflow-y-auto">
        <Products url={url} token={token} />
      </div>
    </div>
  );
}