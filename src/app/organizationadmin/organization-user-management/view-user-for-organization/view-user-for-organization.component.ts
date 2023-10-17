import { Component } from '@angular/core';

@Component({
  selector: 'app-view-user-for-organization',
  templateUrl: './view-user-for-organization.component.html',
  styleUrls: ['./view-user-for-organization.component.scss']
})
export class ViewUserForOrganizationComponent {

  persons: { name: string; secondName: string }[] = [];

}
