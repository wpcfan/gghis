import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { 
  Patient, 
  PaymentMethod,
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
  ageConvertSub: Subscription;
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
  paymentMethods: {paymentMethod: PaymentMethod, label: string}[] = [
    {paymentMethod: PaymentMethod.SELF, label: '自费'},
    {paymentMethod: PaymentMethod.BILLED, label: '记账'},
    {paymentMethod: PaymentMethod.INSURANCE, label: '医保'}
  ]

  constructor(
    private fb: FormBuilder,
    private store$: Store<AppState>) { 
      this.ageConvert$ = this.store$.select(appState => appState.ageConvert);
    }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      gender: ['true', Validators.required],
      bloodType: [BloodType.UNKNOWN, Validators.required],
      age: [''],
      ageUnit: [''],
      dateOfBirth: ['', Validators.required, this.validateDate],
      paymentMethod: [PaymentMethod.SELF, Validators.required],
      phone: ['', Validators.required],
      addr: ['']
    });
    this.ageConvertSub = this.ageConvert$.subscribe(value => this.form.patchValue({
        'age': value.age, 
        'ageUnit': value.ageUnit, 
        'dateOfBirth': value.dateOfBirth
      }, {onlySelf: true, emitEvent: false})
    );
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
      .subscribe(date => {
        this.store$.dispatch({
          type: ageActions.ActionTypes.CHANGE_DATE,
          payload: date
        });
      });
  }

  /**
   * The Subscriptions have to be unsubscribed 
   * otherwise there will be memory leaks.
   */
  ngOnDestroy(){
    if(this.ageSub !== undefined && !this.ageSub.closed)
      this.ageSub.unsubscribe();
    if(this.ageUnitSub !== undefined && !this.ageUnitSub.closed)
      this.ageUnitSub.unsubscribe();
    if(this.dateOfBirthSub !== undefined && !this.dateOfBirthSub.closed)
      this.dateOfBirthSub.unsubscribe();
    if(this.ageConvertSub !== undefined && !this.ageConvertSub.closed)
      this.ageConvertSub.unsubscribe();
  }

  onSubmit({value, valid}) {
    if(!valid) return;
    console.log(JSON.stringify(value));
  }

  /**
   * To validate the input of date of birth
   * The asyncous validator has to be used 
   * as we use valueChanges which is an Observable
   * @param c is the @FormControl to be validated
   */
  validateDate(c: FormControl): {[key: string]: any}{		      
    const result = moment(c.value).isValid
      && moment(c.value).isBefore()
      && moment(c.value).year()> 1900;
    return result? Observable.of(null) : Observable.of({
      valid: false
    });
  }
}