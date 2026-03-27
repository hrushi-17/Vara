export default function Loader({ done }) {
  return (
    <div className={`loader${done ? ' fade-out' : ''}`}>
      <div className="loader-text">VARA</div>
      <div className="loader-line" />
    </div>
  );
}
