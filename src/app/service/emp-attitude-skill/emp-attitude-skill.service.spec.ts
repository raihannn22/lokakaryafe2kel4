import { TestBed } from '@angular/core/testing';

import { EmpAttitudeSkillService } from './emp-attitude-skill.service';

describe('EmpAttitudeSkillService', () => {
  let service: EmpAttitudeSkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpAttitudeSkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
