import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserForOrganizationAdminComponent } from './update-user-for-organization-admin.component';

describe('UpdateUserForOrganizationAdminComponent', () => {
  let component: UpdateUserForOrganizationAdminComponent;
  let fixture: ComponentFixture<UpdateUserForOrganizationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserForOrganizationAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserForOrganizationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
