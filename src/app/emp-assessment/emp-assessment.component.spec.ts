import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAssessmentComponent } from './emp-assessment.component';

describe('EmployeeAssessmentComponent', () => {
  let component: EmployeeAssessmentComponent;
  let fixture: ComponentFixture<EmployeeAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAssessmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
