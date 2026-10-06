import {CSSProperties} from "react";

interface SeparatorProps {
  style?: CSSProperties;
}

export const Separator = ({style}: Readonly<SeparatorProps>) => {
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
};
