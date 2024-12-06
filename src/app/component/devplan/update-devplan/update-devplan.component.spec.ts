import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDevplanComponent } from './update-devplan.component';

describe('UpdateDevplanComponent', () => {
  let component: UpdateDevplanComponent;
  let fixture: ComponentFixture<UpdateDevplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDevplanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDevplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
