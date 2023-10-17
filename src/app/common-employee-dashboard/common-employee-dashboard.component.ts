import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-common-employee-dashboard',
  templateUrl: './common-employee-dashboard.component.html',
  styleUrls: ['./common-employee-dashboard.component.scss']
})
export class CommonEmployeeDashboardComponent {

  constructor(private router: Router,private route: ActivatedRoute){
      const rolekey = 'Role'; // Replace 'yourKey' with the actual key you used for storing the value
        const organizationkey='Organization';
        const storedValue = sessionStorage.getItem(rolekey);
        
    
        // This is for role based dashboard default loding home content
    
        if (storedValue === 'Softwareadmin') {
          this.router.navigate(['software_admin_dashboard'], { relativeTo: this.route });
        } 
        else if (storedValue === 'Organization Admin') {
          this.router.navigate(['dashboard'], { relativeTo: this.route });
        }
         else {
          // Default redirection for other roles
          this.router.navigate(['/userdashboard'], { relativeTo: this.route });
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