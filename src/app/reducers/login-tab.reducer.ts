import { Reducer, Action } from '@ngrx/store';
import { LoginTab } from '../domain/entities.interface';
import {
  TAB_FORGOT,
  TAB_LOGIN,
  TAB_REGISTER
} from '../actions/login-tab.action';

const initialState: LoginTab = {index: 0};

export function loginTabReducer(state: LoginTab = initialState, action: Action): LoginTab {
  switch(action.type){
    case TAB_LOGIN:
      return initialState;
    case TAB_REGISTER:
      return Object.assign({}, {index: 1});
    case TAB_FORGOT:
      return Object.assign({}, {index: 2});
    default:
      return state;
  }
}