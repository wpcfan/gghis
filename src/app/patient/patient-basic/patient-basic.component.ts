import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Patient, BloodType, AgeUnit, AppState } from '../../domain/entities.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-patient-basic',
  templateUrl: './patient-basic.component.html',
  styleUrls: ['./patient-basic.component.scss']
})
export class PatientBasicComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store$: Store<AppState>) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      bloodType: ['', Validators.required],
      age: ['', Validators.required],
      ageUnit: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      phone: ['', Validators.required],
      addr: ['']
    });
    const age$ = this.form.controls['age'].valueChanges.distinctUntilChanged();
    const ageUnit$ = this.form.controls['ageUnit'].valueChanges.distinctUntilChanged();
    const dateOfBirth$ = this.form.controls['dateOfBirth'].valueChanges.distinctUntilChanged();
    const ageComputed$ = Observable.combineLatest(age$, ageUnit$, (a, u)=>{
      if(a === undefined) return a;
      switch (parseInt(u)) {
        case AgeUnit.Day.valueOf():
          return a;
        case AgeUnit.Month.valueOf():
          return a * 30;
        case AgeUnit.Year.valueOf():
        default:
          return a * 365;
      }
    })
    .filter(a=>a!=undefined)
    .subscribe(x=>{
      const date = moment().subtract(x, 'days').format('YYYY-MM-DD');
      this.form.controls['dateOfBirth'].setValue(date);
    });
    
  }

  onSubmit() {
    if(!this.form.valid) return;
    const patient = {
      name: this.form.controls['name'].value,
      gender: this.form.controls['gender'].value,
      bloodType: this.form.controls['bloodType'].value,
      dateOfBirth: this.form.controls['dateOfBirth'].value,
    }  
  }

}
