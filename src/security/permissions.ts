import authProvider from "../providers/authProvider";

export const getPermissions = (role: string) => {
  const whoamiId = authProvider.getCachedWhoami().id;

  const createPermissions = ["list", "read", "show", "create", "export"];
  const updatePermissions = createPermissions.concat("edit");

  const roleDefinitions = {
    ADMIN: [
      {action: "read", resource: "profile", record: {id: whoamiId}},
      {action: updatePermissions, resource: "students"},
      {action: updatePermissions, resource: "teachers"},

      {action: createPermissions, resource: "fees"},
      {action: createPermissions, resource: "payments"},

      {action: updatePermissions, resource: "events"},
      {action: updatePermissions, resource: "event-participants"},
    ],
    MANAGER: [
      {action: "read", resource: "profile", record: {id: whoamiId}},
      {action: updatePermissions, resource: "students"},
      {action: updatePermissions, resource: "teachers"},

      {action: createPermissions, resource: "fees"},
      {action: createPermissions, resource: "payments"},

      {action: updatePermissions, resource: "events"},
      {action: updatePermissions, resource: "event-participants"},
    ],

    TEACHER: [
      {action: "read", resource: "profile", record: {id: whoamiId}},
      {action: ["list", "read", "show"], resource: "students"},

      {action: ["list", "read", "show"], resource: "events"},
      {action: updatePermissions, resource: "event-participants"},
    ],

    STUDENT: [
      {action: "read", resource: "profile", record: {id: whoamiId}},

      {action: ["list", "read", "show"], resource: "fees"},
      {action: ["list", "read", "show"], resource: "payments"},

      {action: ["list", "read", "show"], resource: "event-participants"},
      {action: ["list", "read", "show"], resource: "events"},
    ],
    MONITOR: [
      {action: "read", resource: "profile", record: {id: whoamiId}},
      {action: ["list", "read", "show"], resource: "students"},
    ],
  };
  return roleDefinitions[role as keyof typeof roleDefinitions];
};
