import {HaDataProviderType} from "./HaDataProviderType";

const missingListProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any) {
    const mockData = [
      {
        id: "ep_1",
        event_participant: {
          id: "ep_1",
          ref: "STD000001",
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          nic: "123456789012",
          group_name: "G1",
          event_status: "MISSING",
          student_id: "student_1",
          letter: [
            {
              description: "Absence justification",
              file_url: "https://example.com/letter1.pdf",
              status: "PENDING",
              ref: "letter_ref_1",
              creation_datetime: "2025-04-03T10:00:00.000Z",
            },
          ],
        },
        event: {
          id: "event_1",
          type: "EXAM",
          title: "Final Exam PROG1",
          color: "#FF5733",
          description: "Final examination for Algorithmics course.",
          begin_datetime: "2025-04-10T08:00:00.000Z",
          end_datetime: "2025-04-10T10:00:00.000Z",
          planner: {
            id: "planner_1",
            ref: "PLN001",
            first_name: "Alice",
            last_name: "Smith",
            email: "alice.smith@example.com",
            nic: "987654321098",
          },
          course: {
            id: "course_1",
            code: "PROG1",
            name: "Algorithmics",
            credits: 6,
            total_hours: 60,
          },
          groups: [
            {
              attributed_color: "#fd7200",
              id: "group_1",
              name: "The group number one",
              ref: "G1",
            },
          ],
          count: {
            missing: 1,
            present: 24,
            late: 0,
            total: 25,
          },
        },
      },
      {
        id: "ep_2",
        event_participant: {
          id: "ep_2",
          ref: "STD000002",
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
          nic: "112233445566",
          group_name: "G1",
          event_status: "MISSING",
          student_id: "student_2",
          letter: [],
        },
        event: {
          id: "event_1",
          type: "EXAM",
          title: "Final Exam PROG1",
          color: "#FF5733",
          description: "Final examination for Algorithmics course.",
          begin_datetime: "2025-04-10T08:00:00.000Z",
          end_datetime: "2025-04-10T10:00:00.000Z",
          planner: {
            id: "planner_1",
            ref: "PLN001",
            first_name: "Alice",
            last_name: "Smith",
            email: "alice.smith@example.com",
            nic: "987654321098",
          },
          course: {
            id: "course_1",
            code: "PROG1",
            name: "Algorithmics",
            credits: 6,
            total_hours: 60,
          },
          groups: [
            {
              attributed_color: "#33CFFF",
              id: "group_1",
              name: "The group number one",
              ref: "G1",
            },
          ],
          count: {
            missing: 1,
            late: 0,
            total: 25,
          },
        },
      },
    ];
    return Promise.resolve({data: mockData});
  },
  async getOne(_id: string) {
    throw new Error("Not implemented");
  },
  async saveOrUpdate() {
    throw new Error("Not implemented");
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default missingListProvider;
