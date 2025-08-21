import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import SetList from "./setList";

export default function RoutineDetails() {
  const { data: activities } = useQuery("/activities", "activities");
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

  // Hooks must be called before any returns
  const [sets, setSets] = useState([]);
  useEffect(() => {
    setSets(Array.isArray(routine?.sets) ? routine.sets : []);
  }, [routine?.sets]);

  // Handler to remove set by id
  const handleDeleteSet = (setId) => {
    setSets((prev) => prev.filter((s) => s.id !== setId));
  };

  const [routineDeleteError, setRoutineDeleteError] = useState("");
  const handleDelete = async () => {
    setRoutineDeleteError("");
    try {
      await deleteRoutineApi();
      // Always navigate if no error thrown
      navigate("/routines");
    } catch (err) {
      setRoutineDeleteError(
        err?.message || "You do not have permission to delete this routine."
      );
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

  const name = routine.name || "Unnamed Routine";
  const goal = routine.goal || "No goal provided.";
  const creatorName = routine.creatorName || "Unknown";

  return (
    <div>
      <h2>{name}</h2>
      <p>{goal}</p>
      <p>Created by: {creatorName}</p>
      {token && (
        <>
          <button onClick={handleDelete}>
            {deleting
              ? "Deleting..."
              : deleteError
              ? String(deleteError)
              : "Delete Routine"}
          </button>
          {routineDeleteError && (
            <span style={{ color: "red", marginLeft: 8 }}>
              {routineDeleteError}
            </span>
          )}
        </>
      )}

      <SetList
        sets={sets}
        routineId={id}
        activities={activities}
        onDeleteSet={handleDeleteSet}
        onAddSet={(newSet) => setSets((prev) => [...prev, newSet])}
      />
    </div>
  );
}
