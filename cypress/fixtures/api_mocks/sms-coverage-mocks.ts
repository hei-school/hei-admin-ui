import {
  Admin,
  SmsCampaignLaunched,
  SmsCampaignStatus,
  SmsContact,
  SmsContactGroup,
  SmsContactGroupDetail,
  SmsContactOwnerRole,
  SmsFileRowsRejectedAlert,
  SmsInsufficientBalanceAlert,
} from "@haapi-b0fc7615/typescript-client";
import {admin1Mock} from "./admins-mock";

export const smsCoverageLaunchedMock = (
  recipientCount: number,
  recipientsRejectedForBalance = 0
): SmsCampaignLaunched => ({
  campaignId: "sms_cov_campaign_id",
  recipientCount,
  recipientsRejectedForBalance,
  smsSegmentsEach: 1,
  creditsDebited: recipientCount,
  status: SmsCampaignStatus.CREATED,
});

export const smsCoverageBalanceAlertNoDataMock: SmsInsufficientBalanceAlert = {
  type: "SmsInsufficientBalanceAlert",
};

export const smsCoverageManyRejectedRowsAlertMock: SmsFileRowsRejectedAlert = {
  type: "SmsFileRowsRejectedAlert",
  message: "Certaines lignes du fichier sont invalides",
  rejectedRows: [
    {row: 2, value: "abc", reason: "Numéro invalide"},
    {row: 3, value: "021", reason: "Préfixe invalide"},
    {row: 4, value: "", reason: "Numéro manquant"},
    {row: 5, value: "999", reason: "Trop court"},
  ],
};

export const smsCoverageRefOnlyOwnerMock: Admin = {
  id: "sms_cov_ref_only_owner_id",
  ref: "ADM-REF-ONLY",
};

export const smsCoverageGroupWithoutOwnerMock: SmsContactGroup = {
  id: "sms_cov_group_without_owner_id",
  name: "groupe-sans-proprietaire",
};

export const smsCoverageGroupFilledMock: SmsContactGroup = {
  id: "sms_cov_group_filled_id",
  name: "groupe-rempli",
  ownerId: admin1Mock.id,
  memberCount: 3,
};

export const smsCoverageGroupWithoutNameMock: SmsContactGroup = {
  id: "sms_cov_group_without_name_id",
  ownerId: smsCoverageRefOnlyOwnerMock.id,
  memberCount: 0,
};

export const smsCoverageGroupsForListMock: SmsContactGroup[] = [
  smsCoverageGroupWithoutOwnerMock,
  smsCoverageGroupFilledMock,
];

export const smsCoverageGroupsForPickerMock: SmsContactGroup[] = [
  {id: "sms_cov_picker_group1_id", name: "Promo 2026", memberCount: 4},
  {id: "sms_cov_picker_group2_id", name: "Promo 2027", memberCount: 2},
  smsCoverageGroupWithoutNameMock,
];

export const smsCoverageBareMemberMock: SmsContact = {
  id: "sms_cov_bare_member_id",
};

export const smsCoverageNamedMemberMock: SmsContact = {
  id: "sms_cov_named_member_id",
  name: "Membre Nommé",
  phoneNumber: "0321234500",
  ownerRef: "STD26001",
  ownerRole: SmsContactOwnerRole.STUDENT,
};

export const smsCoverageMemberWithoutIdMock: SmsContact = {
  name: "Membre Sans Identifiant",
  phoneNumber: "0331234501",
};

export const smsCoverageSearchContactMock: SmsContact = {
  id: "sms_cov_search_contact_id",
  name: "Contact Recherché",
  phoneNumber: "0381234502",
  ownerRef: "TCH26001",
  ownerRole: SmsContactOwnerRole.TEACHER,
};

export const smsCoverageSearchContactWithoutRefMock: SmsContact = {
  id: "sms_cov_search_contact_without_ref_id",
  name: "Contact Sans Ref",
  phoneNumber: "0371234503",
  ownerRole: SmsContactOwnerRole.STAFF_MEMBER,
};

export const smsCoverageGroupDetailWithoutNameMock: SmsContactGroupDetail = {
  ...smsCoverageGroupWithoutNameMock,
  members: [smsCoverageBareMemberMock, smsCoverageNamedMemberMock],
};

export const smsCoverageGroupDetailWithMemberWithoutIdMock: SmsContactGroupDetail =
  {
    ...smsCoverageGroupFilledMock,
    members: [smsCoverageMemberWithoutIdMock],
  };
