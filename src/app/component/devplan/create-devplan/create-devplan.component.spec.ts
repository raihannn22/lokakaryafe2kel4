import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDevplanComponent } from './create-devplan.component';

describe('CreateDevplanComponent', () => {
  let component: CreateDevplanComponent;
  let fixture: ComponentFixture<CreateDevplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDevplanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDevplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
