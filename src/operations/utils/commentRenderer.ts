export const commentRenderer = (
  comment: string,
  totalMonthsNumber: number,
  i: number
): string | null => {
  if (comment !== "") {
    if (totalMonthsNumber === 9) {
      return `${comment} M${i + 1}`;
    } else {
      return comment;
    }
  } else {
    return null;
  }
};

declare global {
  interface Window {
    commentRenderer?: typeof commentRenderer;
  }
}

if (typeof window !== "undefined") {
  window.commentRenderer = commentRenderer;
}
