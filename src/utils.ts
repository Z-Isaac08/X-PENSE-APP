export function formatDate(timestamp: string | number | Date) {
  const date = new Date(timestamp);

  // Obtenir les composants de la date
  const day = String(date.getDate()).padStart(2, "0"); // Obtenir le jour et ajouter un zéro devant si nécessaire
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Obtenir le mois (0-indexé) et ajouter un zéro devant si nécessaire
  const year = date.getFullYear(); // Obtenir l'année

  // Retourner la date formatée
  return `${day}-${month}-${year}`;
}

export function parseFormattedDate(formattedDate: string) {
  const [day, month, year] = formattedDate.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function getMonth(date: string) {
  return capitalizeFirstLetter(
    parseFormattedDate(date).toLocaleString("fr-FR", {
      month: "long",
      year: "numeric",
    })
  );
}

export function capitalizeFirstLetter(str: string) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
