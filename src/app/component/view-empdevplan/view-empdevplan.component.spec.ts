import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmpdevplanComponent } from './view-empdevplan.component';

describe('ViewEmpdevplanComponent', () => {
  let component: ViewEmpdevplanComponent;
  let fixture: ComponentFixture<ViewEmpdevplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmpdevplanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewEmpdevplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
