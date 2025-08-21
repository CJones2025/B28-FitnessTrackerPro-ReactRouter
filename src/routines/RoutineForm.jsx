import { useState } from "react";
import useMutation from "../api/useMutation";

export default function RoutineForm() {
  const [error, setError] = useState(null);
  const {
    mutate: createRoutine,
    loading,
    error: mutationError,
  } = useMutation("POST", "/routines", ["routines"]);

  const tryCreateRoutine = async (formData) => {
    const name = formData.get("name");
    const goal = formData.get("goal");
    try {
      await createRoutine({ name, goal });
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <form action={tryCreateRoutine}>
      <label>
        Name
        <input type="text" name="name" required />
      </label>
      <label>
        Goal
        <input type="text" name="goal" required />
      </label>
      <button disabled={loading}>Create Routine</button>
      {(error || mutationError) && <output>{error || mutationError}</output>}
    </form>
  );
}
