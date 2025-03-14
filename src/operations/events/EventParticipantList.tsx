import {PALETTE_COLORS} from "@/haTheme";
import {DeleteWithConfirm, Show} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {useRole} from "@/security/hooks";
import {Event} from "@haapi/typescript-client";
import {Box, Typography} from "@mui/material";
import {FunctionField, SimpleShowLayout} from "react-admin";
import {useParams} from "react-router-dom";
import {StatCard} from "./components";
import {ListContent} from "./components/ListContent";

export function EventParticipantList() {
  const {eventId} = useParams();
  const {isAdmin, isManager, isOrganizer} = useRole();

  return (
    <Box>
      <Show title=" " id={eventId} resource="events">
        <SimpleShowLayout sx={{bgcolor: "white"}}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <FunctionField
              title=" "
              render={(record: Event) => (
                <Typography fontWeight="bold" variant="h6">
                  {record.course?.code
                    ? `Salle ${record.title ?? ""}`
                    : (record.title ?? "")}
                </Typography>
              )}
            />
            {isAdmin() || isManager() || isOrganizer() ? (
              <DeleteWithConfirm
                resourceType="events"
                confirmContent="Voulez-vous vraiment supprimer la présence ?"
                confirmTitle="Confirmation de la suppression de présence"
                redirect="/events"
                buttonProps={{
                  variant: "contained",
                  type: "button",
                }}
              />
            ) : (
              <FunctionField
                title=" "
                render={(record: Event) => (
                  <Typography
                    fontWeight="bold"
                    variant="h6"
                    sx={{
                      backgroundColor: "#fcdfb5",
                      padding: "5px 1vw",
                      color: PALETTE_COLORS.primary,
                      borderRadius: "5px",
                    }}
                  >
                    {record?.course?.code ?? record.title}
                  </Typography>
                )}
              />
            )}
          </Box>
          <DateField label="De" source="begin_datetime" showTime />
          <DateField label="À" source="end_datetime" showTime />
          <FunctionField
            label="Groupes"
            render={(record: Event) => (
              <Typography
                fontSize={{
                  xs: "0.4rem",
                  sm: "0.6rem",
                  md: "0.8rem",
                  lg: "0.9rem",
                  xl: "1rem",
                }}
              >
                {record.groups?.map((group) => group.ref).join(", ")}
              </Typography>
            )}
          />
          <FunctionField
            label="Statistiques"
            render={(record: Event) => <StatCard stats={record.count ?? {}} />}
          />
        </SimpleShowLayout>
      </Show>
      <ListContent eventId={eventId!} />
    </Box>
  );
}
