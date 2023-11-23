import { Component } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-profiledetail-manage',
  templateUrl: './profiledetail-manage.component.html',
  styleUrls: ['./profiledetail-manage.component.scss']
})
export class ProfiledetailManageComponent {
  constructor(private apicallservice: ApicallService){}
  private apiUrl = 'http://localhost:3000/api/users';
  
  isUserPopupOpen = false;
  isUserPopupOpen1 = false;
  user: any = {};
  users: any[] = [];
  showRequiredError: boolean = false;
  invalidAge = false;
  
  
  

  
    // Sample user data, replace with your actual data

  

  openUserPopup(action: 'add' | 'edit' = 'add', userId?: number) {
    console.log("date");
    if (action === 'add') {
      this.isUserPopupOpen = true;
      // Set default values or clear form fields
      this.resetUser();
    } else if (action === 'edit' && userId) {
      const existingUser = this.users.find(u => u.id === userId);
      if (existingUser) {
        this.user = { ...existingUser };
        this.isUserPopupOpen1 = true;
      }
    }
  }
  // validateAge(event: any) {
  //   const birthDate = new Date(event.target.value);
  //   const currentDate = new Date();
  //   const age = Math.floor((currentDate - birthDate) / (365 * 24 * 60 * 60 * 1000));
  
  //   if (age < 18) {
  //     this.invalidAge = true;
  //     this.addError('Date_Of_Birth', 'User must be 18 years or older.');
  //   } else {
  //     this.invalidAge = false;
  //     this.removeError('Date_Of_Birth');
  //   }
  // }

  addUser() {
    // Add your logic to handle user addition here
    this.users.push({ ...this.user, Emailverified: 'No', id: this.users.length + 1 });
    this.resetUser();
    this.closeUserPopup();
  }

  updateUser() {
    // Add your logic to handle user update here
    const index = this.users.findIndex(u => u.id === this.user.id);
    if (index !== -1) {
      this.users[index] = this.user;
      this.resetUser();
      this.closeUserPopup1();
    }
  }

  resetUser() {
    this.user = {};
  }

  closeUserPopup() {
    this.isUserPopupOpen = false;
  }

  closeUserPopup1() {
    this.isUserPopupOpen1 = false;
  }

  editUser(userId: number) {
    this.openUserPopup('edit', userId);
  }

  deleteUser(userId: number, userEmail: string) {
    // Add your logic to handle user deletion here
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    console.log(`User with email ${userEmail} deleted.`);
  }
}