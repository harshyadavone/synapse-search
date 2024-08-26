interface WeatherInfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

export function WeatherInfoCard({
  icon,
  title,
  value,
}: WeatherInfoCardProps): React.ReactElement {
  return (
    <div className="bg-card/60 rounded-lg p-3 flex items-center h-24 w-40">
      <div className="mr-3 text-2xl">{icon}</div>
      <div>
        <p className="text-sm font-medium text-card-foreground">{title}</p>
        <p className="text-lg font-semibold text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
