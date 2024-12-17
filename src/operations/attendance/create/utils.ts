import attendanceProvider from "@/providers/attendanceProvider";
import {AttendanceMovementType, PlaceEnum} from "@haapi/typescript-client";

export const AvailablePlace = Object.entries(PlaceEnum).map((el) => ({
  label: el[0],
  value: el[1],
}));

type QrConfig = {[key: string]: any};

export const defaultQrScannerConfig: QrConfig = {
  pause: 2,
  fps: 30,
  box: 250,
  send: 10,
  interval: 10_000, //ms
  type: AttendanceMovementType.IN,
  place: PlaceEnum.ANDRAHARO,
};

type AttendancePayload = {
  studentId: string;
  type: AttendanceMovementType;
  place: PlaceEnum;
  notify: (message: string, config: any) => void;
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const createAttendance = async ({
  studentId,
  type,
  place,
  notify,
  onSuccess,
  onError,
}: AttendancePayload) => {
  const payload = {
    student_id: studentId,
    created_at: new Date().toISOString(),
    attendance_movement_type: type,
    place: place,
  };

  try {
    await attendanceProvider.saveOrUpdate([payload]);
    onSuccess && onSuccess();
    notify("Présence réussie !", {type: "success"});
  } catch (error) {
    onError && onError(error);
    notify("Échec de la présence.", {type: "error"});
  }
};
