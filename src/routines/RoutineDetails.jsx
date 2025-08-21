import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import SetForm from "./SetForm";

export default function RoutineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    data: routine,
    loading,
    error,
  } = useQuery(`/routines/${id}`, `routine-${id}`);
  const deleteMutation = useMutation("DELETE", `/routines/${id}`, ["routines"]);
  const deleteRoutineApi = deleteMutation.mutate;
  const deleting = deleteMutation.loading;
  const deleteError = deleteMutation.error;

  const handleDelete = async () => {
    try {
      await deleteRoutineApi();
      navigate("/routines");
    } catch {
      // error handled by mutationError
    }
  };

  console.log("Routine details:", routine);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div style={{ color: "red", fontWeight: "bold" }}>
        <p>Sorry! {error}</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  if (!routine || typeof routine !== "object") {
    return (
      <div style={{ color: "red", fontWeight: "bold" }}>
        <p>Routine not found or data is invalid.</p>
        <pre>{JSON.stringify(routine, null, 2)}</pre>
      </div>
    );
  }

  // Defensive checks for properties
  const name = routine.name || "Unnamed Routine";
  const goal = routine.goal || "No goal provided.";
  const creatorName = routine.creatorName || "Unknown";
  const sets = Array.isArray(routine.sets) ? routine.sets : [];

  return (
    <div>
      <h2>{name}</h2>
      <p>{goal}</p>
      <p>Created by: {creatorName}</p>
      {token && (
        <button onClick={handleDelete}>
          {deleting
            ? "Deleting..."
            : deleteError
            ? String(deleteError)
            : "Delete Routine"}
        </button>
      )}
    
      <h3>Sets</h3>
      {sets.length === 0 ? (
        <p>No sets yet. Add a set below!</p>
      ) : (
        <ul>
          {sets.map((set) => (
            <SetItem key={set.id} set={set} routineId={id} token={token} />
          ))}
        </ul>
      )}
      {token && <SetForm routineId={id} />}
    </div>
  );
}

function SetItem({ set, routineId, token }) {
  const {
    mutate: deleteSet,
    loading,
    error,
  } = useMutation("DELETE", `/routines/${routineId}/sets/${set.id}`, [
    `routine-${routineId}`,
  ]);

  return (
    <li>
      <span>
        {set.activityName} - {set.count} reps
      </span>
      {token && (
        <button onClick={() => deleteSet()}>
          {loading ? "Deleting..." : error ? error : "Delete Set"}
        </button>
      )}
    </li>
  );
}
