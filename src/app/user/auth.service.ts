import { Inject, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { User, Err, Auth, AppState } from '../domain/entities.interface';
import * as authAction from '../actions/auth.action';

@Injectable()
export class AuthService {
  private apiUrl;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http$: Http,
    private store$: Store<AppState>,
    @Inject("API_BASE_URL") private baseUrl) { 
      this.apiUrl = `${this.baseUrl}/auth`;
    }

  login(username: string, password: string): void {
    const url = `${this.apiUrl}/login`;
    const auth = {
      username: username,
      password: password
    }
    this.http$.post(
      url, 
      JSON.stringify(auth), 
      {headers: this.headers}
      )
      .subscribe(res => {
        const auth = {
          user: res.json().user,
          token: res.json().token
        };
        this.store$.dispatch({
          type: authAction.ActionTypes.LOGIN_SUCCESS, 
          payload: auth
        });
      },
      err => {
        this.store$.dispatch({
            type: authAction.ActionTypes.LOGIN_FAIL, 
            payload: err.json() as Err
          });
      });
  }

  register(user: User): void {
    const url = `${this.apiUrl}/register`;
    this.http$.post(
      url, 
      JSON.stringify(user), 
      {headers: this.headers}
      )
      .subscribe(res => {
        const auth = {
          user: res.json().user,
          token: res.json().token
        };
        this.store$.dispatch({
          type: authAction.ActionTypes.REGISTER_SUCCESS, 
          payload: auth
        });
      },
      err => {
        this.store$.dispatch({
            type: authAction.ActionTypes.REGISTER_FAIL, 
            payload: err.json() as Err
          });
      });
  }
}
