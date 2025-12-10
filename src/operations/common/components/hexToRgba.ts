export const hexToRgba = (hex: string, alpha = 1) => {
  const sanitized = hex.replace("#", "");
  if (![3, 6].includes(sanitized.length)) return null;
  const digits =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : sanitized;
  const r = parseInt(digits.slice(0, 2), 16);
  const g = parseInt(digits.slice(2, 4), 16);
  const b = parseInt(digits.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
