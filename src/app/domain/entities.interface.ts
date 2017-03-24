import { RouterState } from '@ngrx/router-store';

export interface User {
  id: string;
  name: string;
  gender: boolean;
  phone?: string;
}

export interface Err {
  code: number;
  message: string;
}

export interface Auth {
  user?: User;
  err?: Err;
  token?: string;
}

export interface AppState{
  auth: Auth;
  router: RouterState;
}