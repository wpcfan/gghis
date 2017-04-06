import { RouterState } from '@ngrx/router-store';
import {
  IdentityType,
  ContactType,
  PaymentMethod,
  BloodType,
  AgeUnit
} from './entities.enum';

export interface User {
  id?: string;
  name: string;
  password?: string;
  gender?: boolean;
  phone?: string;
}

export interface Contact{
  type: ContactType;
  name: string;
  phone: string;
  addr: string;
}

export interface Identity{
  identityNo: string;
  identityType: IdentityType;
}

export interface Patient {
  id: string;
  name: string;
  gender: boolean;
  dateOfBirth: Date;
  identities: Identity[];
  bloodType: BloodType;
  height?: number;
  weight?: number;
  phone: string;
  addr?: string;
  contacts?: Contact[]; 
}

export interface Err {
  timestamp: Date;
  status: number;
  error: string;
  exception: string;
  message: string;
  path: string;
}

export interface Auth {
  user?: User;
  err?: Err;
  token?: string;
}

export interface LoginTab {
  index: number;
}

export interface AgeWithUnit{
  age: number;
  ageUnit: AgeUnit;
  dateOfBirth: string;
}

export interface AppState{
  auth: Auth;
  loginTab: LoginTab;
  ageConvert: AgeWithUnit;
  router: RouterState;
}