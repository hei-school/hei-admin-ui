import { HaDataProviderType } from "./HaDataProviderType";


const MOCK_DATA = [
  {
    "id": "abc123",
    "subject": {
      "id": "xyz456",
      "ref": "STD000001",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "nic": "123456789",
      "sex": "M",
      "birth_date": "1990-05-15",
      "birth_place": "Cityville",
      "address": "123 Main Street",
      "phone": "+1234567890",
      "entrance_datetime": "2024-03-01T08:51:35.846Z",
      "status": "ENABLED",
      "specialization_field": "COMMON_CORE",
      "profile_picture": null
    },
    "observer": {
      "id": "observer123",
      "ref": "OBS000001",
      "first_name": "Jane",
      "last_name": "Smith",
      "role": "MANAGER"
    },
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit..Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "creation_datetime": "2024-03-01T08:51:35.846Z"
  },
  {
    "id": "def456",
    "subject": {
      "id": "uvw789",
      "ref": "STD000002",
      "first_name": "Alice",
      "last_name": "Johnson",
      "email": "alice.johnson@example.com",
      "nic": "987654321",
      "sex": "F",
      "birth_date": "1985-08-20",
      "birth_place": "Townsville",
      "address": "456 Oak Avenue",
      "phone": "+9876543210",
      "entrance_datetime": "2024-03-01T09:30:45.123Z",
      "status": "ENABLED",
      "specialization_field": "ADVANCED_MATH",
      "profile_picture": null
    },
    "observer": {
      "id": "observer456",
      "ref": "OBS000002",
      "first_name": "Bob",
      "last_name": "Williams",
      "role": "SUPERVISOR",
      "profile_picture": null
    },
    "content": "Sed euismod justo vel lacus cursus, in iaculis tortor ullamcorper.",
    "creation_datetime": "2024-03-01T09:30:45.123Z"
  },
  {
    "id": "def456",
    "subject": {
      "id": "uvw789",
      "ref": "STD000002",
      "first_name": "Alice",
      "last_name": "Johnson",
      "email": "alice.johnson@example.com",
      "nic": "987654321",
      "sex": "F",
      "birth_date": "1985-08-20",
      "birth_place": "Townsville",
      "address": "456 Oak Avenue",
      "phone": "+9876543210",
      "entrance_datetime": "2024-03-01T09:30:45.123Z",
      "status": "ENABLED",
      "specialization_field": "ADVANCED_MATH",
      "profile_picture": null
    },
    "observer": {
      "id": "observer456",
      "ref": "OBS000002",
      "first_name": "Bob",
      "last_name": "Williams",
      "role": "SUPERVISOR",
      "profile_picture": null
    },
    "content": "Sed euismod justo vel lacus cursus, in iaculis tortor ullamcorper.",
    "creation_datetime": "2024-03-01T09:30:45.123Z"
  }
]

const commentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return MOCK_DATA;
  },
  async getOne(id: string) {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: any) {
    return payload;
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default commentProvider;
