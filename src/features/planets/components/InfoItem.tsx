interface InfoItemProps {
  label: string;
  value: string;
  capitalize?: boolean;
}

export function InfoItem({ label, value, capitalize }: InfoItemProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={`text-lg ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}
