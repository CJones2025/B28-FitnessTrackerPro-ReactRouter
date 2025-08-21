import { useParams, useNavigate } from "react-router-dom";
import useQuery from "../api/useQuery";
import { useAuth } from "../auth/AuthContext";
import useMutation from "../api/useMutation";

/** Shows details for a single activity, including delete button for logged-in users */
export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    data: activity,
    loading,
    error,
  } = useQuery(`/activities/${id}`, `activity-${id}`);
  const deleteMutation = useMutation("DELETE", `/activities/${id}`, [
    "activities",
  ]);
  const deleteActivityApi = deleteMutation.mutate;
  const deleting = deleteMutation.loading;
  const deleteError = deleteMutation.error;

  const handleDelete = async () => {
    try {
      await deleteActivityApi();
      navigate("/activities");
    } catch {
      // error handled by mutationError
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Sorry! {error}</p>;
  if (!activity) return <p>Activity not found.</p>;

  return (
    <div>
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <p>Created by: {activity.creatorName}</p>
      {token && (
        <button onClick={handleDelete}>
          {deleting
            ? "Deleting..."
            : deleteError
            ? String(deleteError)
            : "Delete"}
        </button>
      )}
    </div>
  );
}
