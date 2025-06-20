interface NotificationProps {
  id: string;
  message: string;
  type: "budget" | "expense" | "income" | "alert";
  date: string;
  read: boolean;
  onMarkAsRead: (id: string) => void;
}

const typeColors: Record<string, string> = {
  budget: "border-blue-400 bg-blue-100 dark:bg-blue-900 dark:border-blue-600",
  expense:
    "border-orange-400 bg-orange-100 dark:bg-orange-900 dark:border-orange-600",
  income:
    "border-green-400 bg-green-100 dark:bg-green-900 dark:border-green-600",
  alert: "border-red-500 bg-red-100 dark:bg-red-900 dark:border-red-600",
};

const NotificationCard = ({
  id,
  message,
  type,
  date,
  read,
  onMarkAsRead,
}: NotificationProps) => {
  return (
    <div
      className={`border-l-4 p-3 rounded-md shadow-sm flex items-center justify-between w-full max-w-md mx-auto
        ${typeColors[type]} ${read ? "opacity-60" : ""}`}
    >
      <div className="flex-1">
        <p className="text-sm font-medium leading-tight">{message}</p>
        <span className="text-xs italic text-neutral-500 dark:text-neutral-300">
          {new Date(date).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {!read && (
        <button
          onClick={() => onMarkAsRead(id)}
          className="ml-4 text-sm text-[#3170dd] hover:underline"
        >
          Marquer
        </button>
      )}
    </div>
  );
};

export default NotificationCard;
