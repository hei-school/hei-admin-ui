import {FC} from "react";
import {LinearProgress, useListContext} from "react-admin";

export const EventLoaderCalendar: FC = () => {
  const {isLoading} = useListContext();
  return (
    isLoading && (
      <LinearProgress
        sx={{
          width: "100%",
        }}
      />
    )
  );
};
