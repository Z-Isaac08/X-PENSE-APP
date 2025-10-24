// ✅ Format d'affichage "30 juin 2025"
export function formatDateDisplay(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ✅ Pour récupérer mois + année "juin 2025"
export function getMonthLabel(date: Date | string): string {
  const d = new Date(date);
  return capitalizeFirstLetter(
    d.toLocaleString("fr-FR", {
      month: "long",
      year: "numeric",
    })
  );
}


// ✅ Pour parser une string '2025-06-30' (par exemple depuis un input ou Firestore string brute)
export function parseIsoDate(isoString: string): Date {
  return new Date(isoString);
}

// ✅ Pour comparer facilement les mois/années
export function isSameMonthAndYear(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth()
  );
}

// 🔠 Capitalisation
export function capitalizeFirstLetter(str: string): string {
  if (typeof str !== "string" || str.length === 0) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// 💰 Currency formatting
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

// 📊 Percentage formatting
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// 📈 Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// 🗓️ Get previous month data
export function getPreviousMonth(): { month: number; year: number } {
  const now = new Date();
  const prevMonth = now.getMonth() - 1;
  const year = prevMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = prevMonth < 0 ? 11 : prevMonth;
  return { month, year };
}

// 🗓️ Get current month data
export function getCurrentMonth(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}
