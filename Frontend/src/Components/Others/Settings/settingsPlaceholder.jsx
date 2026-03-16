export default function SettingsPlaceholder({ title }) {
  return (
    <div className="rounded-panel border border-dashed border-border p-10 text-center">
      <h2 className="text-card-title">{title}</h2>
      <p className="mt-2 text-body text-text-secondary">
        This settings section is coming soon. We are actively building it next.
      </p>
    </div>
  );
}
