export type UserRole = 'professor' | 'ta' | 'schoolTeacher' | 'head' | 'student';
export type SchoolStage = 'primary' | 'middle' | 'secondary';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  avatarColor: string;
  stage?: SchoolStage;
  title?: string;
}
