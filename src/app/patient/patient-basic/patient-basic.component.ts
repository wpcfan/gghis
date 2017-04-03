import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { 
  Patient, 
  BloodType, 
  AgeUnit, 
  AgeWithUnit, 
  AppState 
} from '../../domain/entities.interface';
import * as ageActions from '../../actions/age-convert.action';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-patient-basic',
  templateUrl: './patient-basic.component.html',
  styleUrls: ['./patient-basic.component.scss']
})
export class PatientBasicComponent implements OnInit, OnDestroy {
  form: FormGroup;
  ageConvert$: Observable<AgeWithUnit>;
  ageSub: Subscription;
  ageUnitSub: Subscription;
  dateOfBirthSub: Subscription;
  ageUnits: { ageUnit: AgeUnit, label: string}[] = [
    {ageUnit: AgeUnit.Year, label: '岁'},
    {ageUnit: AgeUnit.Month, label: '月'},
    {ageUnit: AgeUnit.Day, label: '天'}
  ];
  bloodTypes: { bloodType: BloodType, label: string }[] = [
    {bloodType: BloodType.A, label: 'A'},
    {bloodType: BloodType.B, label: 'B'},
    {bloodType: BloodType.AB , label: 'AB'},
    {bloodType: BloodType.O , label: 'O'},
    {bloodType: BloodType.UNKNOWN , label: '未知'},
  ];
  constructor(
    private fb: FormBuilder,
    private store$: Store<AppState>) { 
      this.ageConvert$ = this.store$.select(appState => appState.ageConvert);
    }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      gender: ['true', Validators.required],
      bloodType: ['UNKNOWN', Validators.required],
      age: [''],
      ageUnit: [''],
      dateOfBirth: ['', Validators.required, this.validateDate],
      paymentMethod: ['self', Validators.required],
      phone: ['', Validators.required],
      addr: ['']
    });
    this.ageSub = this.form.controls['age'].valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(age => this.store$.dispatch({
        type: ageActions.ActionTypes.CHANGE_AGE,
        payload: age
      }));
    this.ageUnitSub = this.form.controls['ageUnit'].valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(ageUnit => this.store$.dispatch({
        type: ageActions.ActionTypes.CHANGE_UNIT,
        payload: ageUnit
      }));
    this.dateOfBirthSub = this.form.controls['dateOfBirth'].valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(ageUnit => this.store$.dispatch({
        type: ageActions.ActionTypes.CHANGE_DATE,
        payload: this.form.value.dateOfBirth
      }));
  }
  ngOnDestroy(){
    if(this.ageSub !== undefined && !this.ageSub.closed)
      this.ageSub.unsubscribe();
    if(this.ageUnitSub !== undefined && !this.ageUnitSub.closed)
      this.ageUnitSub.unsubscribe();
    if(this.dateOfBirthSub !== undefined && !this.dateOfBirthSub.closed)
      this.dateOfBirthSub.unsubscribe();
  }
  onSubmit({value, valid}) {
    if(!valid) return;
    console.log(JSON.stringify(value));
  }

   validateDate(c: FormControl): {[key: string]: any}{		      
     const result = moment(c.value).isValid
         && moment(c.value).isBefore()
         && moment(c.value).year()> 1900;
      return result? Observable.of(null) : Observable.of({
        valid: false
      });
    }
}