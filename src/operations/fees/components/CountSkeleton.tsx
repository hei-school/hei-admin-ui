import {Skeleton} from "@mui/material";
import {SKELETON_SX} from "./StyleFeeStat";

export const CountSkeleton = ({width}: {width: number}) => (
  <Skeleton animation="wave" variant="text" width={width} sx={SKELETON_SX} />
);
