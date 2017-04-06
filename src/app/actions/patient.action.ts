import { Action } from '@ngrx/store';
import { type } from '../utils/type';
import { Patient } from '../domain/entities.interface';
import { AgeUnit } from '../domain/entities.enum';

export const ActionTypes = {
  ADD_PATIENT:                  type('[Patient] Add Patient'),
  ADD_PATIENT_SUCCESS:          type('[Patient] Patient Added'),
  ADD_PATIENT_FAIL:             type('[Patient] Patient Not Added')
};

export class AddPatientAction implements Action {
  type = ActionTypes.ADD_PATIENT;
  constructor(public payload: Patient){}
}

export class AddPatientSuccessAction implements Action {
  type = ActionTypes.ADD_PATIENT_SUCCESS;
  constructor(public payload: Patient){}
}

export class AddPatientFailAction implements Action {
  type = ActionTypes.ADD_PATIENT_FAIL;
  constructor(public payload: Patient){}
}

export type Actions
  = AddPatientAction
  | AddPatientSuccessAction
  | AddPatientFailAction