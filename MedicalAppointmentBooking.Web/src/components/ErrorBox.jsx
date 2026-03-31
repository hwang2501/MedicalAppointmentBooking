export default function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div
      className="toast-error"
      style={{
        marginTop: 12,
        position: 'static',
        animation: 'none',
        boxShadow: 'none'
      }}
      role="alert"
    >
      <strong>Lỗi:</strong> {message}
    </div>
  );
}
