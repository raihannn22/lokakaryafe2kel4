import { TestBed } from '@angular/core/testing';

import { EmpAchievementSkillService } from './emp-achievement-skill.service';

describe('EmpAchievementSkillService', () => {
  let service: EmpAchievementSkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpAchievementSkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
