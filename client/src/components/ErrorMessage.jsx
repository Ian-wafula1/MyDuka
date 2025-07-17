// Reusable component for displaying error or success messages
export default function ErrorMessage({ type, message }) {
  if (!message) return null;
  return <div className={`message ${type}`}>{message}</div>;
}