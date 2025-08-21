import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

/** Navbar with site navigation links */
export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header>
      <p>Fitness Trackr</p>
      <nav>
        <Link to="/activities">Activities</Link>
        <Link to="/routines">Routines</Link>
        {token ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              logout();
              navigate("/login");
            }}
          >
            Log out
          </a>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
