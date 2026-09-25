import {
  SmsBalance,
  SmsCampaign,
  SmsCampaignStatus,
  SmsContact,
  SmsContactGroup,
  SmsContactGroupDetail,
  SmsContactOwnerRole,
  SmsLog,
  SmsMessageStatus,
  SmsRecipientSource,
} from "@haapi-b0fc7615/typescript-client";
import {admin1Mock} from "./admins-mock";

export const smsBalanceMock: SmsBalance = {
  availableBalance: 1250,
};

export const smsCampaignDeliveredMock: SmsCampaign = {
  id: "sms_campaign_delivered_id",
  message: "Rappel : réunion parents-élèves ce vendredi à 14h.",
  status: SmsCampaignStatus.DELIVERED,
  contactGroupIds: [],
  contactIds: [],
  manualPhoneNumberCount: 2,
  fileImportCount: 0,
  recipientCount: 2,
  recipientsRejectedForBalance: 0,
  deliveredCount: 2,
  failedCount: 0,
  smsSegmentsEach: 1,
  creditsDebited: 2,
  createdById: admin1Mock.id,
  createdByRef: admin1Mock.ref,
  createdByFirstName: admin1Mock.first_name,
  creationDatetime: new Date("2026-09-25T08:39:13Z"),
};

export const smsCampaignFailedMock: SmsCampaign = {
  id: "sms_campaign_failed_id",
  message: "Lorem Ipsum is simply dummy text of the printing industry.",
  status: SmsCampaignStatus.FAILED,
  failureReason: "Solde insuffisant au moment de l'envoi",
  contactGroupIds: [],
  contactIds: [],
  manualPhoneNumberCount: 1,
  fileImportCount: 0,
  recipientCount: 1,
  recipientsRejectedForBalance: 1,
  deliveredCount: 0,
  failedCount: 1,
  smsSegmentsEach: 1,
  creditsDebited: 0,
  createdById: admin1Mock.id,
  createdByRef: admin1Mock.ref,
  createdByFirstName: admin1Mock.first_name,
  creationDatetime: new Date("2026-09-25T08:34:46Z"),
};

export const smsCampaignsMock: SmsCampaign[] = [
  smsCampaignDeliveredMock,
  smsCampaignFailedMock,
];

export const smsLogDeliveredMock: SmsLog = {
  id: "sms_log_delivered_id",
  campaignId: smsCampaignDeliveredMock.id,
  phoneNumber: "0341234567",
  status: SmsMessageStatus.DELIVERED,
  recipientSource: SmsRecipientSource.MANUAL_NUMBER,
  sentDatetime: new Date("2026-09-25T08:39:13Z"),
  deliveredDatetime: new Date("2026-09-25T08:39:20Z"),
};

export const smsLogFailedMock: SmsLog = {
  id: "sms_log_failed_id",
  campaignId: smsCampaignFailedMock.id,
  phoneNumber: "0341234568",
  status: SmsMessageStatus.FAILED,
  recipientSource: SmsRecipientSource.IMPORTED_FILE,
  sentDatetime: new Date("2026-09-25T08:34:46Z"),
  failureReason: "Numéro invalide",
};

export const smsContact1Mock: SmsContact = {
  id: "sms_contact1_id",
  name: "Test Student",
  phoneNumber: "0341234567",
  ownerId: "student1_id",
  ownerRef: "324713409",
  ownerRole: SmsContactOwnerRole.STUDENT,
};

export const smsContact2Mock: SmsContact = {
  id: "sms_contact2_id",
  name: "Test Teacher",
  phoneNumber: "0341234568",
  ownerId: "teacher1_id",
  ownerRef: "TCH21001",
  ownerRole: SmsContactOwnerRole.TEACHER,
};

export const smsContactsMock: SmsContact[] = [smsContact1Mock, smsContact2Mock];

export const smsContactGroup1Mock: SmsContactGroup = {
  id: "sms_contact_group1_id",
  name: "contact-2026",
  ownerId: admin1Mock.id,
  memberCount: 1,
};

export const smsContactGroup2Mock: SmsContactGroup = {
  id: "sms_contact_group2_id",
  name: "group-test",
  ownerId: admin1Mock.id,
  memberCount: 0,
};

export const smsContactGroupsMock: SmsContactGroup[] = [
  smsContactGroup1Mock,
  smsContactGroup2Mock,
];

export const smsContactGroup1DetailMock: SmsContactGroupDetail = {
  ...smsContactGroup1Mock,
  members: [smsContact1Mock],
};
