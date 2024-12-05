import { TestBed } from '@angular/core/testing';

import { EmpDevplanService } from './emp-devplan.service';

describe('EmpDevplanService', () => {
  let service: EmpDevplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpDevplanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
