// KPICard.tsx
import React from "react";

interface KPICardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({ value, label, icon }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-md hover:shadow-lg transition">
      <div className="text-[#3170dd] text-2xl">{icon}</div>
      <div>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};
