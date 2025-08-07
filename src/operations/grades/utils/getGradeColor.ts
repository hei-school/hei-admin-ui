export const getGradeColor = (grade: number) => {
  if (grade >= 16) return "#4caf50";
  if (grade >= 14) return "#8bc34a";
  if (grade >= 12) return "#ffc107";
  if (grade >= 10) return "#ff9800";
  return "#f44336";
};
