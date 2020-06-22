import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetDisplayComponent } from './timesheet-display.component';

describe('TimesheetDisplayComponent', () => {
  let component: TimesheetDisplayComponent;
  let fixture: ComponentFixture<TimesheetDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
