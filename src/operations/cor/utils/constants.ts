import {CorStatus} from "@haapi-b0fc7615/typescript-client";

export const COR_STATUS_CHOICES = [
  {id: CorStatus.IN_PROGRESS, name: "En cours"},
  {id: CorStatus.CANCELED, name: "Annulé"},
  {id: CorStatus.LEAVE, name: "Quitté"},
  {id: CorStatus.NO_SHOW, name: "Non présent"},
  {id: CorStatus.STAY, name: "Resté"},
];
