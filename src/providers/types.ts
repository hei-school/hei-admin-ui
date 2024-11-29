import {
  Admin,
  Manager,
  Monitor,
  Student,
  Teacher,
} from "@haapi/typescript-client";

export interface Doc {
  id: string;
  url: string;
  data: string;
  mime_type: string;
  file_name: string;
  created_at: Date;
  has_owner: boolean;
  owner_id: string;
  type?: string;
}

export type User = Student | Teacher | Manager | Monitor | Admin;
