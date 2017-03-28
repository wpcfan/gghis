import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../domain/entities.interface';
import { TAB_REGISTER, TAB_FORGOT } from '../../actions/login-tab.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store$: Store<AppState>) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit(){
    this.authService.login(
      this.loginForm.controls['username'].value, 
      this.loginForm.controls['password'].value);
  }

  switchToRegister(){
    this.store$.dispatch({type: TAB_REGISTER});
  }

  switchToForgot(){
    this.store$.dispatch({type: TAB_FORGOT});
  }
}
