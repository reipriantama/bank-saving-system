export type GenderEnum = "Male" | "Female";

export interface User {
  id: string;
  auth_id?: string | null;
  fullname: string;
  email: string;
  password_hash?: string | null;
  nickname?: string | null;
  birth_place?: string | null;
  birth_date?: string | null; // Atau Date jika ingin parsing otomatis
  phone_number?: string | null;
  phone_number_verified_at?: string | null; // Atau Date
  gender?: GenderEnum;
  profile_photo_url?: string | null;
  address?: string | null;
  is_active?: boolean;
  created_at?: string | null; // Atau Date
  updated_at?: string | null; // Atau Date
  deleted_at?: string | null; // Atau Date
  created_by?: string | null;
  updated_by?: string | null;
  is_password_set: boolean;
}
