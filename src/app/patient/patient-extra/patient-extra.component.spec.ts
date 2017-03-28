import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientExtraComponent } from './patient-extra.component';

describe('PatientExtraComponent', () => {
  let component: PatientExtraComponent;
  let fixture: ComponentFixture<PatientExtraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientExtraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
