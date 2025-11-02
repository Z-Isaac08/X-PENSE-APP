import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png";
import { type ExpenseInterface } from "../../stores/expenseStore";
import { type IncomeInterface } from "../../stores/incomeStore";

// Fonction utilitaire pour charger une image
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const generateMonthlyReport = async (
  expenses: ExpenseInterface[],
  incomes: IncomeInterface[]
) => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthName = now.toLocaleString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const currentMonthIncomes = incomes.filter((i) => {
    const d = new Date(i.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const totalExpenses = currentMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalIncomes = currentMonthIncomes.reduce(
    (sum, i) => sum + i.amount,
    0
  );
  const balance = totalIncomes - totalExpenses;

  const expenseByCategory: Record<string, number> = {};
  currentMonthExpenses.forEach((e) => {
    expenseByCategory[e.name] = (expenseByCategory[e.name] || 0) + e.amount;
  });

  const incomeByCategory: Record<string, number> = {};
  currentMonthIncomes.forEach((i) => {
    incomeByCategory[i.name] = (incomeByCategory[i.name] || 0) + i.amount;
  });

  const doc = new jsPDF();

  // Charger et afficher le logo
  try {
    const img = await loadImage(logo);
    doc.addImage(img, "PNG", 15, 10, 10, 10);
  } catch (err) {
    console.warn("Logo non chargé :", err);
  }

  doc.setFontSize(18);
  doc.text("Xpense", 40, 22);
  doc.setFontSize(16);
  doc.text(`Rapport Mensuel – ${monthName}`, 14, 35);
  doc.setFontSize(10);
  doc.text(`Date de génération : ${now.toLocaleDateString("fr-FR")}`, 14, 42);

  let y = 50;
  doc.setFontSize(14);
  doc.text("Résumé Financier :", 14, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(`• Revenus totaux : ${totalIncomes.toLocaleString()} FCFA`, 14, y);
  y += 8;
  doc.text(`• Dépenses totales : ${totalExpenses.toLocaleString()} FCFA`, 14, y);
  y += 8;
  doc.text(`• Solde : ${balance.toLocaleString()} FCFA`, 14, y);

  y += 12;
  doc.setFontSize(14);
  doc.text("Dépenses par catégorie :", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Catégorie", "Montant"]],
    body: Object.entries(expenseByCategory).map(([cat, val]) => [
      cat,
      `${val.toLocaleString()} FCFA`,
    ]),
  });

  const nextY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text("Revenus par catégorie :", 14, nextY);

  autoTable(doc, {
    startY: nextY + 4,
    head: [["Catégorie", "Montant"]],
    body: Object.entries(incomeByCategory).map(([cat, val]) => [
      cat,
      `${val.toLocaleString()} FCFA`,
    ]),
  });

  doc.save(`rapport-${monthName}.pdf`);
};
