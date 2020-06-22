import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimesheetComponent } from './add-timesheet.component';

describe('AddTimesheetComponent', () => {
  let component: AddTimesheetComponent;
  let fixture: ComponentFixture<AddTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
