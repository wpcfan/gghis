import { Reducer, Action } from '@ngrx/store';
import { AgeWithUnit, AgeUnit } from '../domain/entities.interface';
import * as ageAction from '../actions/age-convert.action';
import * as moment from 'moment/moment';

const initialAge = 33;
const initialAgeUnit = AgeUnit.Year;
const initialBirthOfDate = moment().subtract(initialAge, 'years').format('YYYY-MM-DD');
const initialState: AgeWithUnit = {
  age: initialAge,
  ageUnit: initialAgeUnit,
  dateOfBirth: initialBirthOfDate
}

export function ageConvertReducer (
  state: AgeWithUnit = initialState, action: ageAction.Actions): AgeWithUnit {
  switch (action.type) {
    case ageAction.ActionTypes.CHANGE_AGE:
      if(action.payload <= 0 || action.payload > 200)
        return state;
      return Object.assign({}, state, {
        age: action.payload, 
        dateOfBirth: calcDateWith(<number>action.payload, state.ageUnit)
      });
    case ageAction.ActionTypes.CHANGE_UNIT:
      return Object.assign({}, state, {
        ageUnit: action.payload,
        dateOfBirth: calcDateWith(state.age, <AgeUnit>action.payload)
      });
    case ageAction.ActionTypes.CHANGE_DATE:
      if(!dateValid(<string>action.payload))
        return state;
      const newAgeWithUnit = buildAgeWithUnit(<string>action.payload)
      return Object.assign({}, newAgeWithUnit);
    default:
      return state;
  }
}

const dateValid = (date: string) => {
  return moment(date).isValid 
        && moment(date).isBefore(moment())
        && moment(date).year()> 1900;
}

const getMomentUnit = (ageUnit: AgeUnit) => {
  switch (ageUnit) {
    case AgeUnit.Day:
      return 'days';
    case AgeUnit.Month:
      return 'months';
    case AgeUnit.Year:
    default:
      return 'years';
  }
}

const calcDateWith = (age: number, ageUnit: AgeUnit) => {
  return moment()
        .subtract(age, getMomentUnit(ageUnit))
        .format('YYYY-MM-DD');
}

const buildAgeWithUnit = (date: string) => {
  const daysDiff = moment().diff(date, 'days');
  const monthsDiff = moment().diff(date, 'months');
  const yearsDiff = moment().diff(date, 'years');

  if(daysDiff < 120){ // less than 120 days
    return {
      age: daysDiff,
      ageUnit: AgeUnit.Day,
      dateOfBirth: date
    }
  } else if(monthsDiff < 24) { // less than 2 years
    return {
      age: monthsDiff,
      ageUnit: AgeUnit.Month,
      dateOfBirth: date
    }
  } else {
    return {
      age: yearsDiff,
      ageUnit: AgeUnit.Year,
      dateOfBirth: date
    }
  }
}