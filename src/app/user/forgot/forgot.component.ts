import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../domain/entities.interface';
import { TAB_REGISTER, TAB_LOGIN } from '../../actions/login-tab.action';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  forgotForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store$: Store<AppState>) { }

  ngOnInit() {
    this.forgotForm = this.fb.group({
      email: ['', Validators.required]
    });
  }
  onSubmit(){
    
  }

  switchToRegister(){
    this.store$.dispatch({type: TAB_REGISTER});
  }

  switchToLogin(){
    this.store$.dispatch({type: TAB_LOGIN});
  }
}
