import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAchievementSkillComponent } from './emp-achievement-skill.component';

describe('EmpAchievementSkillComponent', () => {
  let component: EmpAchievementSkillComponent;
  let fixture: ComponentFixture<EmpAchievementSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpAchievementSkillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpAchievementSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
