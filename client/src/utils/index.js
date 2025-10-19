export const formatDate = (date) => {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export function dateFormatter(dateString) {
  const inputDate = new Date(dateString);
  if (isNaN(inputDate)) return "Invalid Date";
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Safely get initials from a full name.
 * Handles undefined, empty strings, single-word names, and emojis.
 */
export function getInitials(fullName) {
  if (!fullName || typeof fullName !== "string") return ""; // Guard against undefined/null/non-string

  const names = fullName.trim().split(/\s+/); // Split on spaces, handles multiple spaces
  if (names.length === 0) return "";

  const initials = names.slice(0, 2).map((name) => {
    const firstChar = name[0];
    return firstChar ? firstChar.toUpperCase() : "";
  });

  return initials.join("");
}

export const updateURL = ({ searchTerm, navigate, location }) => {
  const params = new URLSearchParams();
  if (searchTerm) params.set("search", searchTerm);
  const newURL = `${location?.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });
  return newURL;
};

export const PRIOTITYSTYELS = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
};

export const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

export const BGS = ["bg-blue-600", "bg-yellow-600", "bg-red-600", "bg-green-600"];

export const getCompletedSubTasks = (items) => items?.filter((item) => item?.isCompleted).length || 0;

export function countTasksByStage(tasks) {
  let inProgressCount = 0,
    todoCount = 0,
    completedCount = 0;

  tasks?.forEach((task) => {
    switch (task.stage?.toLowerCase()) {
      case "in progress":
        inProgressCount++;
        break;
      case "todo":
        todoCount++;
        break;
      case "completed":
        completedCount++;
        break;
    }
  });

  return { inProgress: inProgressCount, todo: todoCount, completed: completedCount };
}
