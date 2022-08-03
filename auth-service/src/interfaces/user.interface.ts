import { UserType } from 'src/enums/user.enum';

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  user_type: UserType.CLIENT;
}