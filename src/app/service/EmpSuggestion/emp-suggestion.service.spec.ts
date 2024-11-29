import { TestBed } from '@angular/core/testing';

import { EmpSuggestionService } from './emp-suggestion.service';

describe('EmpSuggestionService', () => {
  let service: EmpSuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
