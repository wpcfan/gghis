import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { AuthFormComponent } from './auth-form/auth-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AuthFormComponent
  ],
  declarations: [
    LoginComponent, 
    RegisterComponent, 
    ForgotComponent, 
    AuthFormComponent],
  providers: [
    AuthService
  ]
})
export class UserModule { }
