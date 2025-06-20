import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationCard from "../components/notifications/NotificationCard";
import { useNotificationStore } from "../stores/notificationStore";
import { useUserStore } from "../stores/userStore";
import { parseFormattedDate } from "../utils";

const NotificationsPage = () => {
  const { user } = useUserStore();
  const { notifications, AllNotifications, markAsRead } =
    useNotificationStore();

  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    if (user) {
      AllNotifications(user.id);
    }
  }, [AllNotifications, user]);

  const handleMarkAsRead = async (id: string) => {
    if (!user) return;
    await markAsRead(user.id, id);
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    const unread = notifications.filter((n) => !n.read);
    for (const notif of unread) {
      await markAsRead(user.id, notif.id);
    }
  };

  // Navigation mois précédent/suivant
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

  // Filtrage par mois et année
  const filteredNotifications = notifications.filter((notif) => {
    const notifDate = parseFormattedDate(notif.date);
    return (
      notifDate.getMonth() === selectedDate.getMonth() &&
      notifDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const sortedNotifications = filteredNotifications.sort(
    (a, b) =>
      parseFormattedDate(b.date).getTime() -
      parseFormattedDate(a.date).getTime()
  );

  const monthLabel = selectedDate.toLocaleString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen px-6 py-8 md:px-16 text-[#1f1f1f] dark:text-neutral-100 transition-colors duration-500">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <ChevronLeft
            onClick={goToPreviousMonth}
            className="text-2xl font-bold"
          />
          <h1 className="text-2xl md:text-3xl font-bold capitalize">
            {monthLabel}
          </h1>
          <ChevronRight
            onClick={goToNextMonth}
            className="text-2xl font-bold"
          />
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="bg-[#1f1f1f] text-white px-4 py-2 rounded"
        >
          Tout marquer comme lu
        </button>
      </div>

      {sortedNotifications.length === 0 ? (
        <p className="text-gray-500">Aucune notification pour ce mois.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              id={notif.id}
              message={notif.message}
              type={notif.type}
              date={notif.date}
              read={notif.read}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;
