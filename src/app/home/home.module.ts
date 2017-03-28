import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { UserModule } from '../user/user.module';
import { PatientModule } from '../patient/patient.module';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    UserModule,
    PatientModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
