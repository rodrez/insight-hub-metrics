interface POCDisplayProps {
  pointsOfContact?: string[];
}

export function POCDisplay({ pointsOfContact }: POCDisplayProps) {
  if (!pointsOfContact?.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Points of Contact</h4>
      <div className="flex flex-wrap gap-2">
        {pointsOfContact.map((poc, index) => (
          <div key={index} className="text-sm text-muted-foreground">
            {poc}
          </div>
        ))}
      </div>
    </div>
  );
}