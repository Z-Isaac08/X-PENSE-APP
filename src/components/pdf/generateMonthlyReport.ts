import jsPDF from "jspdf";
import autoTable, { type Styles } from "jspdf-autotable";
import logo from "../../assets/logo.png";
import { type ExpenseInterface } from "../../stores/expenseStore";
import { type IncomeInterface } from "../../stores/incomeStore";

// Couleurs du thème
const COLORS = {
  primary: "#3170dd",
  success: "#10B981",
  danger: "#EF4444",
  lightGray: "#F3F4F6",
  darkGray: "#6B7280",
  white: "#FFFFFF",
  black: "#111827",
};

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

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Styles pour les tableaux
  const tableStyles: Partial<Styles> = {
    font: "helvetica",
    fontSize: 10,
    cellPadding: 3,
    lineColor: COLORS.darkGray,
    lineWidth: 0.2,
    textColor: COLORS.black,
    fontStyle: "normal",
    fillColor: COLORS.white,
    halign: "left",
    valign: "middle",
    overflow: "linebreak",
    cellWidth: "wrap",
    minCellHeight: 10,
    minCellWidth: 10,
  };

  const headStyles: Partial<Styles> = {
    fillColor: COLORS.primary,
    textColor: COLORS.white,
    fontStyle: "bold",
    halign: "left",
    font: "helvetica",
    fontSize: 10,
    cellPadding: 3,
    lineColor: COLORS.darkGray,
    lineWidth: 0.2,
    valign: "middle",
    overflow: "linebreak",
    cellWidth: "wrap",
    minCellHeight: 10,
    minCellWidth: 10,
  };

  // Fonction pour ajouter un en-tête de section
  const addSectionHeader = (y: number, title: string): number => {
    doc.setFillColor(COLORS.primary);
    doc.setTextColor(COLORS.white);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.rect(14, y, doc.internal.pageSize.width - 28, 8, "F");
    doc.text(title, 18, y + 5.5);
    return y + 10;
  };

  // En-tête du document
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, doc.internal.pageSize.width, 30, "F");

  try {
    const img = await loadImage(logo);
    doc.addImage(img, "PNG", 20, 8, 15, 15);
  } catch (err) {
    console.warn("Logo non chargé :", err);
  }

  // Titre du rapport
  doc.setFontSize(20);
  doc.setTextColor(COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.text("Rapport Mensuel", 40, 20);

  // Sous-titre avec la période
  doc.setFontSize(12);
  doc.setTextColor(COLORS.white);
  doc.setFont("helvetica", "normal");
  doc.text(monthName, 40, 26);

  // Date de génération
  doc.setFontSize(10);
  doc.setTextColor(COLORS.darkGray);
  doc.text(
    `Généré le ${now.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    14,
    40
  );

  // Section Résumé Financier
  let y = 50;
  y = addSectionHeader(y, "Résumé Financier");

  // Cartes de résumé
  const summaryData = [
    {
      label: "Revenus Totaux",
      value: totalIncomes,
      color: COLORS.success,
    },
    {
      label: "Dépenses Totales",
      value: totalExpenses,
      color: COLORS.danger,
    },
    {
      label: "Solde",
      value: balance,
      color: balance >= 0 ? COLORS.success : COLORS.danger,
    },
  ];

  // Position de départ pour les cartes
  let cardX = 14;
  const cardWidth = (doc.internal.pageSize.width - 42) / 3; // 3 cartes avec espacement

  summaryData.forEach((item, index) => {
    if (index > 0 && index % 3 === 0) {
      cardX = 14;
      y += 30; // Nouvelle ligne
    }

    // Fond de la carte
    doc.setFillColor(COLORS.white);
    doc.setDrawColor(COLORS.lightGray);
    doc.roundedRect(cardX, y, cardWidth - 6, 25, 2, 2, "FD");

    // Ligne de couleur en haut
    doc.setFillColor(item.color);
    doc.rect(cardX, y, cardWidth - 6, 3, "F");

    // Texte
    doc.setTextColor(COLORS.darkGray);
    doc.setFontSize(10);
    doc.text(item.label, cardX + 8, y + 12);

    // Montant
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.black);
    doc.text(`${item.value.toLocaleString("fr-FR")} FCFA`, cardX + 8, y + 20);

    cardX += cardWidth - 3;
  });

  // Section Dépenses par catégorie
  y += 35;
  y = addSectionHeader(y, "Dépenses par Catégorie");

  if (Object.keys(expenseByCategory).length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["Catégorie", "Montant"]],
      body: Object.entries(expenseByCategory).map(([cat, val]) => [
        cat,
        {
          content: `${val.toLocaleString("fr-FR")} FCFA`,
          styles: { halign: "right" },
        },
      ]),
      styles: tableStyles,
      headStyles: { ...headStyles, fillColor: COLORS.danger },
      didDrawPage: (data) => {
        y = data.cursor?.y || y + 10;
      },
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(COLORS.darkGray);
    doc.text("Aucune dépense ce mois-ci", 20, y + 5);
    y += 10;
  }

  // Section Revenus par catégorie
  y += 10;
  y = addSectionHeader(y, "Revenus par Catégorie");

  if (Object.keys(incomeByCategory).length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["Catégorie", "Montant"]],
      body: Object.entries(incomeByCategory).map(([cat, val]) => [
        cat,
        {
          content: `${val.toLocaleString("fr-FR")} FCFA`,
          styles: { halign: "right" },
        },
      ]),
      styles: tableStyles,
      headStyles: { ...headStyles, fillColor: COLORS.success },
      didDrawPage: (data) => {
        y = data.cursor?.y || y + 10;
      },
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(COLORS.darkGray);
    doc.text("Aucun revenu ce mois-ci", 20, y + 5);
    y += 10;
  }

  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Ligne de séparation
    doc.setDrawColor(COLORS.lightGray);
    doc.setLineWidth(0.5);
    doc.line(14, 283, doc.internal.pageSize.width - 14, 283);

    // Numéro de page
    doc.setFontSize(8);
    doc.setTextColor(COLORS.darkGray);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.width - 25,
      290,
      { align: "right" }
    );

    // Copyright
    doc.text(
      `© ${new Date().getFullYear()} Xpense - Tous droits réservés`,
      doc.internal.pageSize.width / 2,
      290,
      { align: "center" }
    );
  }

  doc.save(`rapport-${monthName}.pdf`);
};
