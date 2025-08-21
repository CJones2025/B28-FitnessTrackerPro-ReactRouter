import React from "react";
import { useAuth } from "../auth/AuthContext";
import useMutation from "../api/useMutation";

export default function SetList({
  sets,
  routineId,
  activities,
  onDeleteSet,
  onAddSet,
}) {
  return (
    <>
      <h3>Sets</h3>
      {sets.length > 0 ? (
        <ul className="sets">
          {sets.map((set) => (
            <Set key={set.id} set={set} onDeleteSet={onDeleteSet} />
          ))}
        </ul>
      ) : (
        <p>This routine doesn't have any sets. Add one?</p>
      )}
      <AddSetForm
        routineId={routineId}
        activities={activities}
        onAddSet={onAddSet}
      />
    </>
  );
  function AddSetForm({ routineId, activities, onAddSet }) {
    const { token } = useAuth();
    const {
      mutate: addSet,
      loading,
      error,
    } = useMutation("POST", "/sets", [`routine-${routineId}`]);
    const [formError, setFormError] = React.useState("");
    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError("");
      const formData = new FormData(e.target);
      const activityId = Number(formData.get("activityId"));
      const count = Number(formData.get("count"));
      try {
        const newSet = await addSet({
          activityId,
          routineId: Number(routineId),
          count,
        });
        if (newSet && typeof onAddSet === "function") onAddSet(newSet);
        e.target.reset();
      } catch (err) {
        setFormError(err?.message || "Failed to add set.");
      }
    };
    if (!token) return null;
    if (!Array.isArray(activities) || activities.length === 0) {
      return <p>No activities available to add.</p>;
    }
    return (
      <form onSubmit={handleSubmit} style={{ marginTop: "1em" }}>
        <label>
          Activity:
          <select name="activityId" required>
            <option value="">Select an activity</option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Reps:
          <input type="number" name="count" min="1" required />
        </label>
        <button type="submit" disabled={loading}>
          Add Set
        </button>
        {error && <span style={{ color: "red" }}>{error}</span>}
        {formError && <span style={{ color: "red" }}>{formError}</span>}
      </form>
    );
  }
}

function Set({ set, onDeleteSet }) {
  const { token } = useAuth();
  return (
    <li>
      <p>
        {set.name} × {set.count}
      </p>
      {token && <DeleteButton id={set.id} onDeleteSet={onDeleteSet} />}
    </li>
  );
}

function DeleteButton({ id, onDeleteSet }) {
  const {
    mutate: deleteSet,
    loading,
    error,
  } = useMutation("DELETE", "/sets/" + id, ["routines", "routine"]);
  const [deleteError, setDeleteError] = React.useState("");

  const handleDelete = async () => {
    setDeleteError("");
    try {
      await deleteSet();
      // Remove from UI if no error thrown
      if (typeof onDeleteSet === "function") onDeleteSet(id);
    } catch (err) {
      // Show a friendly error if not allowed
      setDeleteError(
        err?.message || "You do not have permission to delete this set."
      );
    }
  };

  return (
    <>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting" : "Delete set"}
      </button>
      {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
      {deleteError && (
        <span style={{ color: "red", marginLeft: 8 }}>{deleteError}</span>
      )}
    </>
  );
}
