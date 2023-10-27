import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotpasswordComponent {
  email: string = '';

  constructor(private router: Router) {
    // ... constructor code
  }

  onSubmit() {}
    // Add your logic to send a password reset email
    // You can use a service to make an API request to your backend

    // Display a success message or handle errors

    BackToLogin() {
      // Navigate back to the login page when the "Back to Login" button is clicked
      this.router.navigate(['/login']);
  }

}