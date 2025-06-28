export interface NewUser {
  userName: string;
  password: string;
}

export interface User extends NewUser {
  id: string;
}
