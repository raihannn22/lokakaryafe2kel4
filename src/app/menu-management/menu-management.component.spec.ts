import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuManagementComponent } from './menu-management.component';

describe('MenuManagementComponent', () => {
  let component: MenuManagementComponent;
  let fixture: ComponentFixture<MenuManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
