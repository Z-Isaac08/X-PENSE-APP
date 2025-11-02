import { AlertCircle, TrendingDown, TrendingUp, Wallet, X, Check } from "lucide-react";
import type { JSX } from "react";
import { formatDateDisplay } from "../../utils";

interface NotificationProps {
  id: string;
  message: string;
  type: "budget" | "expense" | "income" | "alert";
  date: string;
  read: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
  priority?: "critical" | "important" | "normal";
}

const typeColors: Record<string, string> = {
  budget: "border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400",
  expense: "border-orange-400 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-400",
  income: "border-green-400 bg-green-50 dark:bg-green-900/30 dark:border-green-400",
  alert: "border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-500",
};

const typeIcons: Record<string, JSX.Element> = {
  budget: <Wallet size={20} className="text-blue-600 dark:text-blue-300" />,
  expense: <TrendingDown size={20} className="text-orange-600 dark:text-orange-300" />,
  income: <TrendingUp size={20} className="text-green-600 dark:text-green-300" />,
  alert: <AlertCircle size={20} className="text-red-600 dark:text-red-300" />,
};

const priorityBorders: Record<string, string> = {
  critical: "border-l-4 border-l-red-600",
  important: "border-l-4 border-l-orange-500",
  normal: "border-l-4 border-l-gray-400",
};

const NotificationCard = ({
  id,
  message,
  type,
  date,
  read,
  onMarkAsRead,
  onDelete,
  priority = "normal",
}: NotificationProps) => {
  const isRecent = () => {
    const notifDate = new Date(date);
    const now = new Date();
    const diffHours = (now.getTime() - notifDate.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  const getPriorityDot = () => {
    const colors = {
      critical: "bg-red-500",
      important: "bg-orange-500", 
      normal: "bg-gray-400",
    };
    return (
      <div 
        className={`w-2 h-2 rounded-full ${colors[priority]} ${!read ? 'animate-pulse' : ''}`}
        title={`Priorité: ${priority}`}
      />
    );
  };

  return (
    <div
      className={`${priorityBorders[priority]} rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-md group
        ${typeColors[type]} ${read ? "opacity-75" : ""} ${isRecent() ? "ring-2 ring-blue-200 dark:ring-blue-800" : ""}`}
    >
      <div className="p-4">
        {/* Header with icon, priority and actions */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {typeIcons[type]}
            {getPriorityDot()}
            {isRecent() && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                Nouveau
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!read && (
              <button
                onClick={() => onMarkAsRead(id)}
                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                title="Marquer comme lu"
              >
                <Check size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                title="Supprimer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Message content */}
        <div className="mb-3">
          <p className={`text-sm leading-relaxed ${read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200 font-medium'}`}>
            {message}
          </p>
        </div>

        {/* Footer with date and read status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDateDisplay(new Date(date))}
          </span>
          
          {!read && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Non lu
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
