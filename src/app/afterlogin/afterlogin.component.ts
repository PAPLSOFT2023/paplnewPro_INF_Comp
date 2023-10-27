import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-afterlogin',
  template: '<app-sidenav (onToggleSideNav)="onToggleSideNav($event)"></app-sidenav><app-body [collapsed]="isSideNavCollapsed" [screenWidth]="screenWidth"><router-outlet></router-outlet></app-body>',

})
export class AfterloginComponent {

constructor(private router: Router,
private route: ActivatedRoute){
  const rolekey = 'Role'; // Replace 'yourKey' with the actual key you used for storing the value
    const organizationkey='Organization';
    const storedValue = sessionStorage.getItem(rolekey);
    const stored_organization=sessionStorage.getItem(organizationkey)
    

    // This is for role based dashboard default loding home content

    if (storedValue === 'Softwareadmin') {
      this.router.navigate(['software_admin_dashboard'], { relativeTo: this.route });
    } 
    else if (storedValue === 'Organization Admin') {
      this.router.navigate(['dashboard'], { relativeTo: this.route });
    }
     
    else if (
      storedValue !== null &&
      stored_organization !== null &&
      storedValue.toLowerCase() === 'planning and engineering' &&
      stored_organization.toLowerCase() === 'papl'
    ) {
      // Redirect for roles with 'planning and engineering' and organizationKey 'papl'
      this.router.navigate(['plan_eg_home'], { relativeTo: this.route });
    }
    else if (
      storedValue !== null &&
      stored_organization !== null &&
      storedValue.toLowerCase() === 'sales' &&
      stored_organization.toLowerCase() === 'papl'
    ) {
      // Redirect for roles with 'planning and engineering' and organizationKey 'papl'
      this.router.navigate(['sales_home'], { relativeTo: this.route });
    }
    else if (
      storedValue !== null &&
      stored_organization !== null &&
      storedValue.toLowerCase() === 'inspection' &&
      stored_organization.toLowerCase() === 'papl'
    ) {
      // Redirect for roles with 'planning and engineering' and organizationKey 'papl'
      this.router.navigate(['inspection_home'], { relativeTo: this.route });
    }
    


}


  title = 'sidenav-with-multilevel-menu';

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
