import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../domain/entities.interface';
import { TAB_LOGIN, TAB_FORGOT } from '../../actions/login-tab.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store$: Store<AppState>) { }

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        repeat: ['', Validators.required]
      }, 
      {
        validator: this.areEqual('password', 'repeat')
      }
     );
  }

  onSubmit(){
    this.authService.register({
      name: this.registerForm.controls['username'].value,
      password: this.registerForm.controls['password'].value
    });
  }

  switchToLogin(){
    this.store$.dispatch({type: TAB_LOGIN});
  }

  switchToForgot(){
    this.store$.dispatch({type: TAB_FORGOT});
  }
  
  areEqual(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
}
