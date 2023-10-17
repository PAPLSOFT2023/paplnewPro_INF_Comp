import { Component } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-user-for-organization-admin',
  templateUrl: './create-user-for-organization-admin.component.html',
  styleUrls: ['./create-user-for-organization-admin.component.scss']
})
export class CreateUserForOrganizationAdminComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    terms: false,
    organization_display_name:'',
    organization:'',
    role:'',
    status:'',
    statusnum:0
  };
loginstatus=['Active','Inactive'];
loginrole=['sales'];
  constructor(private authservice:ApicallService,private router:Router){}
  Submit_status:any;
  Passwords_status:any; 
  formSubmitted = false;
  passwordMismatch = false;
  passwordVisible1 = false;
  passwordVisible2 = false;
  submitForm() {
    const rolekey = 'Role'; // Replace 'yourKey' with the actual key you used for storing the value
    const organizationkey='Organization';
    const storedValue = sessionStorage.getItem(rolekey);
    this.userData.organization_display_name=sessionStorage.getItem(organizationkey) as string;
    this.userData.organization=sessionStorage.getItem(organizationkey) as string;

    
    if(this.userData.status==="Active")
    {
      this.userData.statusnum= 1 ;
    }
    else{
      this.userData.statusnum= 0 ;
    }


    this.Submit_status="";
    this.Passwords_status="";


console.log(this.userData);

    if(this.userData.name && this.userData.email && this.userData.password && this.userData.confirm_password && this.userData.organization_display_name && this.userData.organization && this.userData.role && this.userData.status ){
    this.formSubmitted = true;

    if (this.userData.password !== this.userData.confirm_password) {
      this.Passwords_status="Password and Confirm Password do not match."; 
      this.passwordMismatch = true;
      return;
    }
    else{
      console.log(this.userData);
      
      this.authservice.adminregister(this.userData.email,this.userData.password,this.userData.organization_display_name,this.userData.role,this.userData.statusnum,"Organization Admin",this.userData.name,0,"sample").subscribe(
        (response: any) => {
          if(response)
          {
            this.passwordMismatch = false;
            this.Submit_status="Register successful";
            alert("Register successful and Please Verify Mail"); 
            
            this.userData.name =''; this.userData.email =''; this.userData.password='';
            this.userData.confirm_password =''; this.userData.organization_display_name ='';
             this.userData.organization='';
             this.formSubmitted = false;
             this.passwordMismatch = false;
            this.passwordVisible1 = false;
            this.passwordVisible2 = false;
            this.Submit_status='';

           
        
          }
        },
        (error: any) => {
          this.passwordMismatch = false;
          if (error.error && error.error.message) {
            this.Submit_status = error.error.message;
          }
           else {
            // If the error response doesn't have the expected structure, handle it accordingly
            this.Submit_status = 'An error occurred.';
          }
        }
      );
    }
  }
  else{
    alert("Please Enter All Fields");
  }
  }

  togglePasswordVisibility1() {
    this.passwordVisible1 = !this.passwordVisible1;
    
  }
  togglePasswordVisibility2() {
    this.passwordVisible2 = !this.passwordVisible2;
    
  }
}
