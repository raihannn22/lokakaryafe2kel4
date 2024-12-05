import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDevplanComponent } from './emp-devplan.component';

describe('EmpDevplanComponent', () => {
  let component: EmpDevplanComponent;
  let fixture: ComponentFixture<EmpDevplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpDevplanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpDevplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
