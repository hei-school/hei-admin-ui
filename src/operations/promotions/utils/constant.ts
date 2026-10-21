import {CycleEnum} from "@haapi-3d601c85/typescript-client";

export const CYCLE_LEVEL = [
  {id: CycleEnum.BACHELOR, name: "BACHELOR"},
  {id: CycleEnum.MASTER, name: "MASTER"},
  {id: CycleEnum.DOCTORATE, name: "DOCTORATE"},
] as const;

export const CYCLE_LEVEL_CHOICES = CYCLE_LEVEL.map((choice) => ({
  name: choice.name,
  id: choice.id,
}));
