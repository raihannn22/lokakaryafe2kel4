import { TestBed } from '@angular/core/testing';
import { DivisiService } from './divisi.service';


describe('DivisiService', () => {
  let service: DivisiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivisiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
