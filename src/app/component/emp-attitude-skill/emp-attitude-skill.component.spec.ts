import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAttitudeSkillComponent } from './emp-attitude-skill.component';

describe('EmpAttitudeSkillComponent', () => {
  let component: EmpAttitudeSkillComponent;
  let fixture: ComponentFixture<EmpAttitudeSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpAttitudeSkillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpAttitudeSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
