import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevplanComponent } from './devplan.component';

describe('DevplanComponent', () => {
  let component: DevplanComponent;
  let fixture: ComponentFixture<DevplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevplanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
