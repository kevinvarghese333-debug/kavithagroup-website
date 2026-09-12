export function PortraitPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter((part) => !["Dr.", "Mr.", "Mrs."].includes(part))
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="portrait-placeholder" aria-label={`Portrait placeholder for ${name}`}>
      <span>{initials}</span>
      <small>Portrait to be added</small>
    </div>
  );
}
