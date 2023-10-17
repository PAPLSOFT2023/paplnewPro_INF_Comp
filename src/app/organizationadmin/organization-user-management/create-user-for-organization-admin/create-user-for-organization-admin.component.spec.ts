import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserForOrganizationAdminComponent } from './create-user-for-organization-admin.component';

describe('CreateUserForOrganizationAdminComponent', () => {
  let component: CreateUserForOrganizationAdminComponent;
  let fixture: ComponentFixture<CreateUserForOrganizationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUserForOrganizationAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUserForOrganizationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
