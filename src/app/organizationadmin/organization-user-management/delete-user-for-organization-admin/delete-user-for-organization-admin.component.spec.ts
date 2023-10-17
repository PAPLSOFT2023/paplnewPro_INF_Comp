import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserForOrganizationAdminComponent } from './delete-user-for-organization-admin.component';

describe('DeleteUserForOrganizationAdminComponent', () => {
  let component: DeleteUserForOrganizationAdminComponent;
  let fixture: ComponentFixture<DeleteUserForOrganizationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUserForOrganizationAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUserForOrganizationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
