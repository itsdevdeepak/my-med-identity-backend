export interface MedicalHistory {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userID?: string;
  condition: string;
  illness: string;
  medication: string;
  allergies: string;
  Immunizations: string;
}
