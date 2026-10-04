interface TimelineBlockProps {
  events: Array<{ date: string; title: string; description?: string; icon?: string }>;
  style: {
    orientation: "horizontal" | "vertical";
  };
}

export function TimelineBlock({ events, style }: TimelineBlockProps) {
  const isVertical = style.orientation === "vertical";

  return (
    <div className={isVertical ? "space-y-4" : "flex space-x-4 overflow-x-auto pb-4"}>
      {events.map((event, index) => (
        <div key={index} className={isVertical ? "flex gap-4" : "flex-shrink-0 flex gap-4"}>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex-shrink-0" />
            {index < events.length - 1 && (
              <div className={isVertical ? "w-0.5 h-8 bg-gray-300 dark:bg-gray-600 mt-2" : "w-8 h-0.5 bg-gray-300 dark:bg-gray-600"} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.date}</p>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
            )}
            {event.icon && <span className="text-2xl mt-2">{event.icon}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
