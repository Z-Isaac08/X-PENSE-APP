import { AlertCircle, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { JSX } from "react";

interface NotificationProps {
  id: string;
  message: string;
  type: "budget" | "expense" | "income" | "alert";
  date: string;
  read: boolean;
  onMarkAsRead: (id: string) => void;
}

const typeColors: Record<string, string> = {
  budget: "border-blue-400 bg-blue-100 dark:bg-blue-900 dark:border-blue-100",
  expense:
    "border-orange-400 bg-orange-100 dark:bg-orange-900 dark:border-orange-100",
  income:
    "border-green-400 bg-green-100 dark:bg-green-900 dark:border-green-100",
  alert: "border-red-500 bg-red-100 dark:bg-red-900 dark:border-red-100",
};

const typeIcons: Record<string, JSX.Element> = {
  budget: <Wallet size={20} className="text-blue-600 dark:text-blue-300" />,
  expense: (
    <TrendingDown size={20} className="text-orange-600 dark:text-orange-300" />
  ),
  income: (
    <TrendingUp size={20} className="text-green-600 dark:text-green-300" />
  ),
  alert: <AlertCircle size={20} className="text-red-600 dark:text-red-300" />,
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
      className={`border-l-4 p-3 rounded-md shadow-sm flex items-center justify-between w-full max-w-md mx-auto transition-opacity duration-300 ease-in-out
        ${typeColors[type]} ${read ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="pt-1">{typeIcons[type]}</div>
        <div>
          <p className="text-sm font-medium leading-tight">{message}</p>
          <span
            title={new Date(date).toLocaleString("fr-FR")}
            className="text-xs italic text-neutral-500 dark:text-neutral-300"
          >
            {new Date(date).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {!read && (
        <button
          onClick={() => onMarkAsRead(id)}
          className="ml-4 text-sm text-[#3170dd] hover:underline cursor-pointer"
          aria-label={`Marquer la notification ${id} comme lue`}
        >
          Marquer
        </button>
      )}
    </div>
  );
};

export default NotificationCard;
