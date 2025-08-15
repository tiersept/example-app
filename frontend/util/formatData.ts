export const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown Date";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return "Invalid Date";
  }
};
