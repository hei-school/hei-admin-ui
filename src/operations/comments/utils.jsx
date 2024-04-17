export function Separator({style}) {
  return (
    <div
      style={{
        height: "1px",
        width: "100%",
        backgroundColor: "#b0adac",
        marginBottom: "20px",
        ...style,
      }}
    />
  );
}
