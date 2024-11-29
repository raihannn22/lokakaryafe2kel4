import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSuggestionComponent } from './emp-suggestion.component';

describe('EmpSuggestionComponent', () => {
  let component: EmpSuggestionComponent;
  let fixture: ComponentFixture<EmpSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpSuggestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
