import {useRole} from "@/security/hooks";
import {HeiListMenuItem} from "@/ui/haLayout/menu/common";
import {ListMenu, ListMenuItem, SingleMenu} from "@/ui/haLayout/menu/utils";
import {trackNavClick} from "@/utils/gtm";
import {
  Newspaper as AnnouncementIcon,
  Archive as ArchiveIcon,
  AccountBalanceWallet as CreditPaymentsIcon,
  Inventory as DocsIcon,
  HistoryEdu as DocumensoIcon,
  EditCalendar,
  EventBusy,
  CalendarMonth as EventIcon,
  AttachMoney as FeesIcon,
  GradeOutlined as GradeIcon,
  Group as GroupIcon,
  LibraryBooksOutlined as LibraryIcon,
  SupervisedUserCircle as MonitorIcon,
  MenuBook as PromotionIcon,
  PublishedWithChanges as RemedialIcon,
  SafetyDivider,
  Campaign as SmsCampaignIcon,
  GroupWork as SmsContactGroupIcon,
  Contacts as SmsContactIcon,
  Sms as SmsIcon,
  AssignmentInd as StaffIcon,
  School as StudentIcon,
  People as StudentListIcon,
  Work as TeachersIcon,
  CurrencyExchange as TransactionsIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";
import {GraduationCap} from "lucide-react";

const AdminMenu = () => {
  const {role} = useRole();
  return (
    <Box>
      <SingleMenu
        to="/teachers"
        label="Enseignants"
        icon={<TeachersIcon />}
        onClick={() => trackNavClick("teachers", role)}
      />
      <SingleMenu
        to="/monitors"
        label="Moniteurs"
        icon={<MonitorIcon />}
        onClick={() => trackNavClick("monitors", role)}
        data-testid="monitors-menu"
      />
      <ListMenu
        label="Étudiants"
        icon={<StudentIcon />}
        data-testid="students-menu"
      >
        <ListMenuItem
          label="Liste des étudiants"
          icon={<StudentListIcon />}
          to="/students"
          onClick={() => trackNavClick("students_list", role)}
        />
        <ListMenuItem
          label="Liste des paiements par crédit"
          icon={<CreditPaymentsIcon />}
          to="/credit-payments"
          onClick={() => trackNavClick("payments_list", role)}
        />
        <ListMenuItem
          label="Frais à archiver"
          icon={<ArchiveIcon />}
          to="/fees-to-archive"
          onClick={() => trackNavClick("fees_to_archive", role)}
        />
        <ListMenuItem
          label="Liste des sortants"
          icon={<GraduationCap />}
          to="promotions/result-overviews"
          onClick={() => trackNavClick("students_result_overviews", role)}
        />
        <ListMenuItem
          label="Transactions (Mobile Money)"
          icon={<TransactionsIcon />}
          to="/transactions"
          onClick={() => trackNavClick("transactions", role)}
        />
        <ListMenuItem
          label="Frais (en retard par défaut)"
          icon={<FeesIcon />}
          to="/fees"
          onClick={() => trackNavClick("fees", role)}
        />
      </ListMenu>
      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <HeiListMenuItem onClick={() => trackNavClick("hei_docs", role)} />
        <ListMenuItem
          to="/documenso-documents"
          label="Documenso"
          data-testid="documenso-documents-menu"
          icon={<DocumensoIcon />}
          onClick={() => trackNavClick("documenso_documents", role)}
        />
      </ListMenu>
      <SingleMenu
        to="/promotions"
        label="Promotions"
        data-testid="promotions-menu"
        icon={<PromotionIcon />}
        onClick={() => trackNavClick("promotions", role)}
      />
      <SingleMenu
        to="/course"
        label="Cours"
        data-testid="course-menu"
        icon={<LibraryIcon />}
        onClick={() => trackNavClick("courses", role)}
      />
      <SingleMenu
        to="/exams"
        label="Examens"
        data-testid="exams-menu"
        icon={<GradeIcon />}
        onClick={() => trackNavClick("exams", role)}
      />
      <SingleMenu
        to="/retakeExams-sessions"
        label="Rattrapages"
        data-testid="retakeExamsSessions-menu"
        icon={<RemedialIcon />}
        onClick={() => trackNavClick("retakeExamsSessions", role)}
      />
      <SingleMenu
        to="/cor"
        label="COR"
        icon={<SafetyDivider />}
        onClick={() => trackNavClick("cor", role)}
      />
      <SingleMenu
        to="/groups"
        label="Groupes"
        icon={<GroupIcon />}
        onClick={() => trackNavClick("groups", role)}
      />
      <SingleMenu
        to="/announcements"
        label="Annonces"
        icon={<AnnouncementIcon />}
        onClick={() => trackNavClick("announcements", role)}
      />
      <ListMenu
        icon={<EditCalendar />}
        label="Pointage"
        data-testid="event-point"
      >
        <ListMenuItem
          data-testid="event-menu"
          to="/events"
          label="Présences"
          icon={<EventIcon />}
          onClick={() => trackNavClick("events", role)}
        />
        <ListMenuItem
          data-testid="event-missing"
          to="/event_participants"
          label="Liste des absents"
          icon={<EventBusy />}
          onClick={() => trackNavClick("event_participants", role)}
        />
      </ListMenu>
      <SingleMenu
        to="/staffmembers"
        label="Staff"
        icon={<StaffIcon />}
        onClick={() => trackNavClick("staffmembers", role)}
      />
      <ListMenu label="SMS" icon={<SmsIcon />} data-testid="sms-menu">
        <ListMenuItem
          label="Campagnes"
          icon={<SmsCampaignIcon />}
          to="/sms-campaigns"
          onClick={() => trackNavClick("sms_campaigns", role)}
        />
        <ListMenuItem
          label="Groupes de contacts"
          icon={<SmsContactGroupIcon />}
          to="/sms-contact-groups"
          onClick={() => trackNavClick("sms_contact_groups", role)}
        />
        <ListMenuItem
          label="Contacts"
          icon={<SmsContactIcon />}
          to="/sms-contacts"
          onClick={() => trackNavClick("sms_contacts", role)}
        />
      </ListMenu>
    </Box>
  );
};

export default AdminMenu;
