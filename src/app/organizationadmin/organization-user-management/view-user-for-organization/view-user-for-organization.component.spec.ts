import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserForOrganizationComponent } from './view-user-for-organization.component';

describe('ViewUserForOrganizationComponent', () => {
  let component: ViewUserForOrganizationComponent;
  let fixture: ComponentFixture<ViewUserForOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserForOrganizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserForOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
