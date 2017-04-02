import { RouterState } from '@ngrx/router-store';

export enum IdentityType {
  IdCard = 0,
  Passport,
  DriverLicense,
  ResidenceBooklet,
  SpecialDistrict,
  Military,
  Soldier,
  Civilian,
  Other
}

export enum BloodType {
  UNKNOWN = 0,
  A,
  B,
  AB,
  O
}

export enum AgeUnit {
  Year = 0,
  Month,
  Day
}

export interface User {
  id?: string;
  name: string;
  password?: string;
  gender?: boolean;
  phone?: string;
}

export interface Patient {
  id: string;
  name: string;
  gender: boolean;
  dateOfBirth: Date;
  insuraceNo: string;
  identityNo: string;
  identityType: IdentityType;
  bloodType: BloodType;
  height: number;
  weight: number;
  phone: string;
  addr: string;
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