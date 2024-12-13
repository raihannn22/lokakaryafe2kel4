import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullAssSumComponent } from './full-ass-sum.component';

describe('FullAssSumComponent', () => {
  let component: FullAssSumComponent;
  let fixture: ComponentFixture<FullAssSumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullAssSumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullAssSumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
