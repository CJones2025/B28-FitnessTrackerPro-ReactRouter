import { useAuth } from "../auth/AuthContext";
import useQuery from "../api/useQuery";
import RoutineForm from "./RoutineForm";
import { Link } from "react-router-dom";

export default function RoutinesPage() {
  const { token } = useAuth();
  const { data: routines, loading, error } = useQuery("/routines", "routines");

  return (
    <div>
      <h1>Routines</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Sorry! {error}</p>
      ) : Array.isArray(routines) ? (
        <ul>
          {routines.map((routine) => (
            <li key={routine.id}>
              <Link to={`/routines/${routine.id}`}>{routine.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No routines found.</p>
      )}
      {token && <RoutineForm />}
    </div>
  );
}
