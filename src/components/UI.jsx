import { Link } from "react-router-dom";
export function Button({ children, variant = "primary", ...props }) {
  return (
    <button className={`button ${variant}`} {...props}>
      {children}
    </button>
  );
}
export function LinkButton({ to, children, variant = "primary" }) {
  return (
    <Link className={`button ${variant}`} to={to}>
      {children}
    </Link>
  );
}
export function Badge({ children }) {
  return <span className="badge">{children}</span>;
}
export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Loading({ message = "기록을 불러오고 있어요…" }) {
  return (
    <div className="state" role="status">
      <span className="spinner" />
      {message}
    </div>
  );
}
export function ErrorState({ message, onRetry }) {
  return (
    <div className="state error" role="alert">
      <h2>잠시, 확인이 필요해요</h2>
      <p>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          다시 시도
        </Button>
      )}
    </div>
  );
}
export function EmptyState({
  title = "아직 기록이 없어요",
  description = "오늘 배운 내용을 첫 기록으로 남겨보세요.",
  action,
}) {
  return (
    <div className="state">
      <span className="empty-icon">✎</span>
      <h2>{title}</h2>
      <p className="muted">{description}</p>
      {action}
    </div>
  );
}
export function Field({ label, name, error, multiline, ...props }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Tag
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="field-error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
export function StatCard({ label, value, detail }) {
  return (
    <div className="stat-card">
      <p className="muted">{label}</p>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
export function AsyncContent({ loading, error, retry, children }) {
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  return children;
}
