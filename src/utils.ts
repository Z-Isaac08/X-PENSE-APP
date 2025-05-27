export function formatDate(timestamp: string | number | Date) {
  const date = new Date(timestamp);

  // Obtenir les composants de la date
  const day = String(date.getDate()).padStart(2, "0"); // Obtenir le jour et ajouter un zéro devant si nécessaire
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Obtenir le mois (0-indexé) et ajouter un zéro devant si nécessaire
  const year = date.getFullYear(); // Obtenir l'année

  // Retourner la date formatée
  return `${day}-${month}-${year}`;
}