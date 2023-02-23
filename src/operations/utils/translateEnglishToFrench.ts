export const translateEnglishToFrench = (word: string): string => {
  switch (word.toLowerCase()) {
    case 'late':
      return 'en retard'
    default:
      return "Le mot n'est pas encore implémenté"
  }
}
