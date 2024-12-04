import { TestBed } from '@angular/core/testing';

import { DevplanService } from './devplan.service';

describe('DevplanService', () => {
  let service: DevplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevplanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
