import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { Patient, BloodType, AgeUnit, AppState } from '../../domain/entities.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-patient-basic',
  templateUrl: './patient-basic.component.html',
  styleUrls: ['./patient-basic.component.scss']
})
export class PatientBasicComponent implements OnInit {
  form: FormGroup;
  merged$: Observable<BirthDay>
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
      dateOfBirth: ['', Validators.compose([Validators.required, this.validateDate])],
      paymentMethod: ['', Validators.required],
      phone: ['', Validators.required],
      addr: ['']
    });
    const age$ = this.form.controls['age'].valueChanges
      .distinctUntilChanged()
      .startWith(33);
    const ageUnit$ = this.form.controls['ageUnit'].valueChanges
      .distinctUntilChanged()
      .startWith(AgeUnit.Year);
    const computed$ = Observable.combineLatest(age$, ageUnit$, (a, u)=>{
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
    .filter(a => a!== undefined)
    .map(a => moment().subtract(a, 'days').format('YYYY-MM-DD'));

    const dateOfBirth$ = this.form.controls['dateOfBirth'].valueChanges
      .filter(d => {
        if(moment(d).isValid 
        && moment(d).isBefore()
        && moment(d).year() > 1900)
        return d;
      });
    this.merged$ = dateOfBirth$.merge(computed$)
      .map(date => {
        const birth = moment(date, 'YYYY-MM-DD')
        const days = moment().diff(birth, 'days');
        if(days <= 90) {
          return {
            age: days,
            ageUnit: AgeUnit.Day.valueOf(),
            dateOfBirth: date
          }
        } else if (days <= 720){
          return {
            age: Math.round(days/30),
            ageUnit: AgeUnit.Month.valueOf(),
            dateOfBirth: date
          }
        } else {
          return {
            age: Math.round(days/365),
            ageUnit: AgeUnit.Year.valueOf(),
            dateOfBirth: date
          }
        }
      });
      this.merged$
      .distinctUntilChanged()
      .subscribe(birthday => {
        if(this.form.controls['age'].value !== birthday.age)
          this.form.controls['age'].setValue(birthday.age);
        if(this.form.controls['ageUnit'].value !== birthday.ageUnit)
          this.form.controls['ageUnit'].setValue(birthday.ageUnit);
        if(this.form.controls['dateOfBirth'].value !== birthday.dateOfBirth)
          this.form.controls['dateOfBirth'].setValue(birthday.dateOfBirth);
      });
  }

  
  validateDate(c: FormControl): {[key: string]: any}{
    const result = moment(c.value).isValid 
        && moment(c.value).isBefore()
        && moment(c.value).year()> 1900;
    return {
      "valid": result
    }
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

export interface BirthDay{
  age: number;
  ageUnit: number;
  dateOfBirth: string;
}