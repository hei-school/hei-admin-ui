export interface Doc {
  id: string
  url: string
  data: string
  mime_type: string
  file_name: string
  created_at: Date
  has_owner: boolean
  owner_id: string
  type?: string
}
