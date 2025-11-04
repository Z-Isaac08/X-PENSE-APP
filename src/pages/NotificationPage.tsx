import { CheckCheck, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import NotificationCard from "../components/notifications/NotificationCard";
import NotificationFilters from "../components/notifications/NotificationFilters";
import NotificationStats from "../components/notifications/NotificationStats";
import { useNotificationStore } from "../stores/notificationStore";
import type { NotificationInterface } from "../stores/notificationStore";
import { useUserStore } from "../stores/userStore";
import { getMonthLabel, isSameMonthAndYear, parseIsoDate } from "../utils";

const NotificationsPage = () => {
  const { user } = useUserStore();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotifications,
    clearAllNotifications,
    getNotificationStats,
    getFilteredNotifications,
    getNotificationsByPriority,
  } = useNotificationStore();

  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [activeFilter, setActiveFilter] = useState<{
    type?: string;
    read?: boolean;
    priority?: string;
  }>({});

  const [showStats, setShowStats] = useState(false);

  const handleMarkAsRead = async (id: string) => {
    if (!user) return;
    await markAsRead(user.id, id);
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    await markAllAsRead(user.id);
  };

  const handleDeleteNotification = async (id: string) => {
    if (!user) return;
    await removeNotifications(user.id, id);
  };

  const handleClearAll = async () => {
    if (!user) return;
    if (
      confirm("Êtes-vous sûr de vouloir supprimer toutes les notifications ?")
    ) {
      await clearAllNotifications(user.id);
    }
  };

  const createdAt = user?.createdAt ? parseIsoDate(user.createdAt) : new Date();
  const canGoPrevious = !isSameMonthAndYear(selectedDate, createdAt);

  const goToPreviousMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Get filtered notifications based on month and active filters
  const monthFilteredNotifications = notifications.filter(
    (notif: NotificationInterface) => {
      const notifDate = parseIsoDate(notif.date);
      return isSameMonthAndYear(notifDate, selectedDate);
    }
  );

  // Apply additional filters
  const baseFiltered = getFilteredNotifications({
    ...activeFilter,
    dateRange: {
      start: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      ).toISOString(),
      end: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      ).toISOString(),
    },
  });

  // Apply priority filtering if needed
  let finalNotifications = baseFiltered;
  if (activeFilter.priority) {
    const priorityGroups = getNotificationsByPriority();
    finalNotifications =
      priorityGroups[activeFilter.priority as keyof typeof priorityGroups] ||
      [];
    finalNotifications = finalNotifications.filter(
      (notif: NotificationInterface) =>
        baseFiltered.some(
          (filtered: NotificationInterface) => filtered.id === notif.id
        )
    );
  }

  const sortedNotifications = finalNotifications.sort(
    (a: NotificationInterface, b: NotificationInterface) =>
      parseIsoDate(b.date).getTime() - parseIsoDate(a.date).getTime()
  );

  const stats = getNotificationStats();
  const monthLabel = getMonthLabel(selectedDate);
  const unreadCount = monthFilteredNotifications.filter((n: NotificationInterface) => !n.read).length;

  const determinePriority = (
    notification: NotificationInterface
  ): "critical" | "important" | "normal" => {
    if (
      notification.type === "alert" ||
      notification.message.includes("Budget dépassé") ||
      notification.message.includes("Limite atteinte")
    ) {
      return "critical";
    } else if (
      notification.type === "expense" &&
      (notification.message.includes("élevée") ||
        notification.message.includes("augmentation"))
    ) {
      return "important";
    }
    return "normal";
  };

  return (
    <main className="min-h-screen px-6 py-8 md:px-16 text-[#1f1f1f] dark:text-neutral-100 transition-colors duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <ChevronLeft
            onClick={canGoPrevious ? goToPreviousMonth : undefined}
            className={`text-2xl font-bold ${
              canGoPrevious
                ? "cursor-pointer text-current hover:text-[#3170dd]"
                : "text-gray-400 cursor-not-allowed"
            } transition-colors`}
          />
          <h1 className="text-2xl md:text-3xl font-bold capitalize">
            Notifications - {monthLabel}
          </h1>
          <ChevronRight
            onClick={goToNextMonth}
            className="text-2xl font-bold cursor-pointer hover:text-[#3170dd] transition-colors"
          />
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} non lu{unreadCount > 1 ? "es" : ""}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            📊 {showStats ? "Masquer" : "Statistiques"}
          </button>

          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
          >
            <CheckCheck size={16} />
            Tout marquer lu
          </button>

          <button
            onClick={handleClearAll}
            disabled={monthFilteredNotifications.length === 0}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} />
            Tout supprimer
          </button>
        </div>
      </div>

      {/* Stats */}
      {showStats && <NotificationStats stats={stats} />}

      {/* Filters */}
      <NotificationFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        stats={stats}
      />

      {/* Notifications */}
      {sortedNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold mb-2">Aucune notification</h3>
          <p className="text-gray-500">
            {activeFilter.type ||
            activeFilter.read !== undefined ||
            activeFilter.priority
              ? "Aucune notification ne correspond aux filtres sélectionnés."
              : "Aucune notification pour ce mois."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedNotifications.map((notif: NotificationInterface) => (
            <NotificationCard
              key={notif.id}
              id={notif.id}
              message={notif.message}
              type={notif.type}
              date={notif.date}
              read={notif.read}
              priority={determinePriority(notif)}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;
