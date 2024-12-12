import {AttendanceMovementType, PlaceEnum} from "@haapi/typescript-client";

export const AvailablePlace = Object.entries(PlaceEnum).map((el) => ({
  label: el[0],
  value: el[1],
}));

type QrConfig = {[key: string]: any};

const defaultConfig: QrConfig = {
  pause: 2,
  fps: 30,
  box: 250,
  send: 10,
  interval: 10_000, //ms
  type: AttendanceMovementType.IN,
  place: PlaceEnum.ANDRAHARO,
};

const getConfig = () => {
  const config = localStorage.getItem("qr-config");
  return config ? JSON.parse(config) : defaultConfig;
};
const setConfig = (config: QrConfig) =>
  localStorage.setItem(
    "qr-config",
    JSON.stringify({...getConfig(), ...config})
  );

const setAttendance = (newStore = "") =>
  localStorage.setItem("attendance-store", JSON.stringify(newStore));
const getAttendance = () => {
  const data = localStorage.getItem("attendance-store");
  return data ? JSON.parse(data) : [];
};

export const qrcode = {
  setAttendance,
  getAttendance,
  getConfig,
  setConfig,
  defaultConfig,
};
