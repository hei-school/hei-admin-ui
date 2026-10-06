export const commentFunctionRenderer = (data: {comment?: string | null}) =>
  data.comment == null ? "  -  " : data.comment;
