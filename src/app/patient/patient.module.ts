import { NgModule } from '@angular/core';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { PatientBasicComponent } from './patient-basic/patient-basic.component';
import { SharedModule } from '../shared/shared.module';
import { PatientExtraComponent } from './patient-extra/patient-extra.component';
import { PatientService } from './patient.service';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    ProfileFormComponent,
    PatientBasicComponent
  ],
  providers:[],
  declarations: [ProfileFormComponent, PatientBasicComponent, PatientExtraComponent]
})
export class PatientModule { }
