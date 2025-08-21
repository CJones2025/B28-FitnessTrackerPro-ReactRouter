import { useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";

export default function SetForm({ routineId }) {
  const [error, setError] = useState(null);
  const {
    data: activities,
    loading: loadingActivities,
    error: activitiesError,
  } = useQuery("/activities", "activities");
  const {
    mutate: addSet,
    loading,
    error: mutationError,
  } = useMutation("POST", `/routines/${routineId}/sets`, [
    `routine-${routineId}`,
  ]);

  const tryAddSet = async (formData) => {
    const activityId = formData.get("activityId");
    const count = formData.get("count");
    try {
      await addSet({ activityId, count });
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loadingActivities) return <p>Loading activities...</p>;
  if (activitiesError) return <p>Sorry! {activitiesError}</p>;

  if (!Array.isArray(activities) || activities.length === 0) {
    return (
      <div style={{ color: "orange", marginTop: "1em" }}>
        <strong>Cannot add set:</strong> No activities available.
        <br />
        Please add activities first or check your connection.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    tryAddSet(new FormData(e.target));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Activity
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
        Reps
        <input type="number" name="count" min="1" required />
      </label>
      <button disabled={loading}>Add Set</button>
      {(error || mutationError) && (
        <output>
          {error || mutationError}
          <br />
          <pre>{JSON.stringify(error || mutationError, null, 2)}</pre>
        </output>
      )}
    </form>
  );
}
