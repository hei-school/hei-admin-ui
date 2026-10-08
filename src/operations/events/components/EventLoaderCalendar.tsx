import {LinearProgress, useListContext} from "react-admin";

export const EventLoaderCalendar = () => {
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
