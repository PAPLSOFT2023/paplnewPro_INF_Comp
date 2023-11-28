// Import necessary modules and services
import { Component, OnInit } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { DatePipe } from '@angular/common';


// Component decorator with metadata
@Component({
  selector: 'app-profiledetail-manage',
  templateUrl: './profiledetail-manage.component.html',
  styleUrls: ['./profiledetail-manage.component.scss']
})
export class ProfiledetailManageComponent implements OnInit {
  // Properties for user data  NAME,email_id,PSN_NO,designation,contact_no,date_of_joining,date_of_birth,dept
  users: { NAME: string, email_id: string, PSN_NO: string, designation: string, contact_no: number, date_of_joining: Date, date_of_birth: Date, dept: string }[] = [];
  user: {  NAME: string, email_id: string, PSN_NO: string, designation: string, contact_no: number, date_of_joining: Date, date_of_birth:Date, dept: string } = { NAME: '', email_id: '', PSN_NO: '', designation: '', contact_no: 0, date_of_joining:  new Date(), date_of_birth: new Date(), dept: '' };

  // Additional properties for user management
  existingmail: string = '';
  statusnumber: number = 0;
  emailverifidenumber: number = 0;
  editMode: boolean = false;
  departments: string[] = [];
  roles: string[] = [];
  organizations: string[] = [];
ngOnInit() {
   
    this.loadDataFromDB();
    
  }

  
  // Change closeUserPopup1 to closeUserPopup
closeUserPopup() {
  this.isUserPopupOpen = false;
  this.isUserPopupOpen1 = false;
  this.resetUser();
}
closeUserPopup1() {
  this.isUserPopupOpen1 = false;
  this.resetUser();
}
editUser(userId: string) {
  this.openUserPopup('edit', userId);
}

  // Method to open user popup for add or edit
  openUserPopup(action: 'add' | 'edit' = 'add', userId?: string) {
    // console.log("date");
    if (action === 'add') {
      this.isUserPopupOpen = true;
      // Set default values or clear form fields
      this.resetUser();
    } 
    else if (action === 'edit' && userId) {
      const existingUser = this.users.find(u => u.email_id === userId);

      if (existingUser) {
        this.user = { ...existingUser };
        console.log("====",this.user)
        this.isUserPopupOpen1 = true;
      }
    }
  }

  // Method to add a new user
  addUser() {
    // Add your logic to handle user addition here
    this.users.push({ ...this.user });
    this.resetUser();
    this.closeUserPopup();
  }

  // Method to update an existing user
  updateUser() {
    // Add your logic to handle user update here
    const index = this.users.findIndex(u => u.email_id === this.user.email_id);
    if (index !== -1) {
      this.users[index] = { ...this.user };
      this.resetUser();
      this.closeUserPopup1();
    }
  }

  // Method to delete a user
  deleteUser(userId: string, userEmail: string) {
    // Add your logic to handle user deletion here
    const index = this.users.findIndex(u => u.email_id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    console.log(`User with email ${userEmail} deleted.`);
  }

  // Method to reset user data
  resetUser() {
    this.user = { NAME: '', email_id: '', PSN_NO: '', designation: '', contact_no: 0, date_of_joining: new Date(), date_of_birth:new Date(), dept: '' };
  }
// Method to generate a new user ID
private generateUserId(): number {
  return this.users.length + 1;
}





  // Constructor with ApicallService injection
  constructor(private apicallservice: ApicallService,private datePipe: DatePipe) { }

  // API endpoint URL
  private apiUrl = 'http://localhost:3000/api/users';

  // Flags for user popups and errors
  isUserPopupOpen = false;
  isUserPopupOpen1 = false;
  showRequiredError: boolean = false;
  invalidAge = false;

  // Angular lifecycle hook - component initialization


  // Method to load user data from the API
  loadDataFromDB() {
    console.log("*(*(*(*(")
    
    this.apicallservice.get_emp_data().subscribe(
      (response: any) => {
        console.log("*******",response)
        this.users = response.map((user: any) => ({
          ...user,
          date_of_joining: this.parseDate(user.date_of_joining),
          date_of_birth: this.parseDate(user.date_of_birth)
        }));
      },
      (error: any) => {
        console.log(error);
      }
    );
  }// In your Angular component
  // In your Angular component
  update_emp_data() {
  const userId = this.user.NAME; // Assuming NAME is the unique identifier
  this.apicallservice.update_emp_data(userId, this.user).subscribe(
    (response: any) => {
      console.log('User updated successfully:', response);
      // You might want to reload data after successful update
      this.loadDataFromDB();
      this.resetUser();
      this.closeUserPopup1();
    },
    (error: any) => {
      console.error('Error updating user:', error);
      // Handle error scenario
    }
  );
}
// Method to parse date strings into Date objects
  private parseDate(dateString: string): Date {
    return new Date(dateString);
  }
  
  // Public method to format a date
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy/MM/dd') || '';
  }
}

 
  

