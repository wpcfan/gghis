import { Action } from '@ngrx/store';
import { type } from '../utils/type';
import { AgeWithUnit, AgeUnit } from '../domain/entities.interface';

export const ActionTypes = {
  CHANGE_UNIT:        type('[AgeWithUnit] Change Unit'),
  CHANGE_AGE:         type('[AgeWithUnit] Change Age'),
  CHANGE_DATE:        type('[AgeWithUnit] Change Date')
};

export class ChangeUnitAction implements Action {
  type = ActionTypes.CHANGE_UNIT;
  constructor(public payload: AgeUnit){}
}

export class ChangeAgeAction implements Action {
  type = ActionTypes.CHANGE_AGE;
  constructor(public payload: number){}
}

export class ChangeDateAction implements Action {
  type = ActionTypes.CHANGE_DATE;
  constructor(public payload: string){}
}

export type Actions
  = ChangeUnitAction
  | ChangeAgeAction
  | ChangeDateAction