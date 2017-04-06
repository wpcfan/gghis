import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { 
  Patient, 
  AgeWithUnit, 
  AppState 
} from '../../domain/entities.interface';
import {
  PaymentMethod,
  BloodType, 
  AgeUnit, 
  IdentityType
} from '../../domain/entities.enum';
import {
  extractInfo,
  buildAddr,
  buildDate
} from '../../domain/gb2260.interface';
import { dateValid } from '../../utils/date';
import * as ageActions from '../../actions/age-convert.action';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-patient-basic',
  templateUrl: './patient-basic.component.html',
  styleUrls: ['./patient-basic.component.scss']
})
export class PatientBasicComponent implements OnInit, OnDestroy {
  form: FormGroup;
  minDate: string = new Date(1900,1,1).toISOString();
  maxDate: string = new Date(2999,1,1).toISOString();
  ageConvert$: Observable<AgeWithUnit>;
  ageSub: Subscription;
  ageUnitSub: Subscription;
  dateOfBirthSub: Subscription;
  ageConvertSub: Subscription;
  idSub: Subscription;
  idTypeSub: Subscription;
  idTypeSubject: BehaviorSubject<IdentityType>;
  ageUnits: { value: AgeUnit, label: string}[] = [
    {value: AgeUnit.Year, label: '岁'},
    {value: AgeUnit.Month, label: '月'},
    {value: AgeUnit.Day, label: '天'}
  ];
  bloodTypes: { value: BloodType, label: string }[] = [
    {value: BloodType.A, label: 'A'},
    {value: BloodType.B, label: 'B'},
    {value: BloodType.AB , label: 'AB'},
    {value: BloodType.O , label: 'O'},
    {value: BloodType.UNKNOWN , label: '未知'},
  ];
  paymentMethods: {value: PaymentMethod, label: string}[] = [
    {value: PaymentMethod.SELF, label: '自费'},
    {value: PaymentMethod.BILLED, label: '记账'},
    {value: PaymentMethod.INSURANCE, label: '医保'}
  ];
  identityTypes: {value: IdentityType, label: string}[] = [
    {value: IdentityType.IdCard, label: '身份证'},
    {value: IdentityType.Insurance, label: '医保'},
    {value: IdentityType.Passport, label: '护照'},
    {value: IdentityType.SpecialDistrict, label: '港澳通行证'},
    {value: IdentityType.ResidenceBooklet, label: '户口簿'},
    {value: IdentityType.DriverLicense, label: '驾照'},
    {value: IdentityType.Military, label: '军官证'},
    {value: IdentityType.Soldier, label: '士兵证'},
    {value: IdentityType.Civilian, label: '文职官员证'},
    {value: IdentityType.Civilian, label: '其它'}
  ];
  genders: {value: boolean, label:string}[] = [
    {value: true, label: '男'},
    {value: false, label: '女'}
  ]

  constructor(
    private fb: FormBuilder,
    private store$: Store<AppState>) { 
      this.ageConvert$ = this.store$.select(appState => appState.ageConvert);
    }

  ngOnInit() {
    this.initForm();
    this.handleAgeBirthdayValues();
    this.handleIdValues();
  }

  initForm(){
    this.form = this.fb.group({
      paymentMethod: [PaymentMethod.SELF, Validators.required],
      identityType: [IdentityType.IdCard],
      identityNo: [''],
      name: ['', Validators.required],
      gender: [true, Validators.required],
      bloodType: [BloodType.UNKNOWN, Validators.required],
      height: ['', this.validateHeight],
      weight: ['', this.validateWeight],
      age: [''],
      ageUnit: [''],
      dateOfBirth: ['', Validators.required, this.validateDate],
      phone: ['', Validators.required],
      addr: ['']
    });
  }

  handleAgeBirthdayValues(){
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

  handleIdValues(){
    this.idTypeSubject = new BehaviorSubject<IdentityType>(this.form.get('identityType').value);
    const idNo$ = this.form.get('identityNo').valueChanges
      .debounceTime(500)
      .filter(c => c !== undefined);

    const idType$ = this.form.get('identityType').valueChanges
      .debounceTime(500);

    this.idTypeSub = idType$.subscribe(v => {
      this.idTypeSubject.next(v);
    });

    const idWithLatest$ = this.idTypeSubject.asObservable();

    const id$ = Observable.combineLatest(idWithLatest$, idNo$, (t, i) => {
      return {type: t, num: i}
    })
    .filter(val => val.type === IdentityType.IdCard)
    .map(v => v.num);
    this.idSub = id$.subscribe(i => {
      this.form.get('identityNo').setValidators([this.validateIdNumber]);
      this.form.get('identityNo').updateValueAndValidity();
      if(this.form.get('identityNo').valid && this.form.get('identityNo').value !== null){
        const id = extractInfo(i);
        this.form.patchValue({
          'addr': id.addr,
          'gender': id.gender,
          'dateOfBirth': id.dateOfBirth
        });
      }
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
    if(this.idSub !== undefined && !this.idSub.closed)
      this.idSub.unsubscribe();
    if(this.idTypeSub !== undefined && !this.idTypeSub.closed)
      this.idTypeSub.unsubscribe();
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
    return dateValid(c.value) ? Observable.of(null) : Observable.of({
      dateNotValid: true
    });
  }

  validateWeight(c: FormControl): {[key: string]: any}{
    if(c.value===undefined || c.value==='') return null;
    const result = c.value > 0 && c.value < 400;
    return result? null : {
      weightNotValid:  true
    }
  }

  validateHeight(c: FormControl): {[key: string]: any}{
    if(c.value===undefined || c.value==='') return null;
    const result = c.value > 10 && c.value < 250;
    return result? null : {
      heightNotValid:  true
    }
  }

  validateIdNumber(c: FormControl): {[key: string]: any}{
    const value = c.value;
    if(value === undefined 
      || value === null 
      || value === '') return null;
    if(value.length !== 18) return {idNotValid: true};
    const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/;
    let result = false;
    if(pattern.test(value)){
      const addrPart = buildAddr(value.substring(0,6));
      const birthPart = buildDate(value.substring(6,14));
      const genderPart = parseInt(value.substring(14,17));
      if(addrPart !== null && birthPart !== null && !isNaN(genderPart))
        result = true;
    }
    return result? null : {idNotValid:  true}
  }
  
}