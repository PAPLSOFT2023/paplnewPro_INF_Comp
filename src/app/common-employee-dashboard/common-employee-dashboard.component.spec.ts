import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEmployeeDashboardComponent } from './common-employee-dashboard.component';

describe('CommonEmployeeDashboardComponent', () => {
  let component: CommonEmployeeDashboardComponent;
  let fixture: ComponentFixture<CommonEmployeeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonEmployeeDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonEmployeeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
