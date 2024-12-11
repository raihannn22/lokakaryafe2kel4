import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySelfComponent } from './summary-self.component';

describe('SummarySelfComponent', () => {
  let component: SummarySelfComponent;
  let fixture: ComponentFixture<SummarySelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummarySelfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummarySelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
