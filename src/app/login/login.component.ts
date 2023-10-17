import { Component } from '@angular/core';
import { ApicallService } from '../apicall.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false; // Added property for password visibility toggle

  constructor(private authService: ApicallService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        const token = response.token;
        const status = response.status;
        const role1 = response.role;
        const organization = response.organization;

        // Store the token and user information in session storage
        sessionStorage.setItem('Role', role1);
        sessionStorage.setItem('Organization', organization);

        // Redirect to another page or perform desired actions
        if (status === 1) {
          console.log(role1, organization);
          this.router.navigate(['/afterlogin', { role: role1 }]);
        } else {
          alert('You do not have a valid subscription.');
        }
      },
      (error: any) => {
        console.error(error);
        if (error.status === 401) {
          // Unauthorized: Invalid username or password
          // Display an error message to the user
          alert('Unauthorized user');
        } else {
          // Handle other types of errors (e.g., server errors)
          alert('An error occurred');
        }
        // Handle login error
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}