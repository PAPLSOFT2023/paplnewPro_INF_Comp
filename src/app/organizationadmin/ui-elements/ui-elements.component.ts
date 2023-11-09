import { Component, ElementRef, ViewChild,Renderer2,AfterViewInit} from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-ui-elements',
  templateUrl: './ui-elements.component.html',
  styleUrls: ['./ui-elements.component.scss']
})
export class UiElementsComponent  {

  constructor(private http: HttpClient, private apicallservice: ApicallService) {}
// this is profile data 
  organization_name: string = '';
  address: string = '';
  pincode: string = '';
  state: string = '';
  country: string = '';
  contact: string = ''; // end of profile data
  

  selectedData: string = ''; // selected Department Data
  NewRole_Data:string='';// getting new role
  isDataEntryVisible: boolean = false;


  departments: string[] = [];
  roles: string[] = [];
  organizations: string[] = [];

  

  departmenttext:string=''
  newRollData: string = '';
  RolldataItems: string[] = [];
  newDepartmentData: string = '';
  DepartmentdataItems: string[] = [];
   uniqueRolls = new Set<string>();
   uniqueDepartments = new Set<string>();


  tooltipText: string = ''
  organizationRoles !:any[];
  // Properties for controlling the popup forms
  isPopupVisible1: boolean = false;
  isPopupVisible2: boolean = false;
  isPopupVisible_dumptype:boolean=false;
  isPopupVisible3: boolean = false;
  isPopupVisible4: boolean = false;
  field1: string = '';
  field2: string = '';
  field3: string = '';
  field4: string = '';

  // Reference to the popup form element in the template
  @ViewChild('popupForm') popupForm!: ElementRef;

  onEmailChange() {
    this.tooltipText = "";
  }

  // Method to open the data entry form
  openDataEntry(): void {
    this.isDataEntryVisible = !this.isDataEntryVisible;
  }
  addToDropdownRole(roledata:string): void {

    if(roledata !=null)
    {
      const organization = sessionStorage.getItem("Organization") as string;
      this.apicallservice.InsertRoleData(roledata, organization).subscribe((response:any)=>{
      
        alert(response.message)  
        this.departments.push(this.departmenttext)
    },(error:any)=>{
      if(error.status==400)
      { 
        alert("This data already exists")
      }
      else{
        alert(error.message)
      }
      
      
      
    });

      


    }
  }
  // Method to add data to the dropdown and database
  addToDropdownDepartment(): void {

    if(this.departmenttext !=null)
    {
     
      this.apicallservice.InsertDepartmentData(this.departmenttext,sessionStorage.getItem("Organization") as string).subscribe((response:any)=>{
      
          alert(response.message)  
          this.departments.push(this.departmenttext)

           
          
        
      },(error:any)=>{
        if(error.status==400)
        {
          alert("This data already exists")
        }
        else{
          alert(error.message)
        }
        
        
        
      });


      


    }
  }

// delete Role Data
  deleteData2(): void {
    // console.log("rnjfnjnfwkjewjr",this.selectedData)
    if (this.selectedData) {

      this.apicallservice.deleteRoleData(sessionStorage.getItem("Organization") as string,this.selectedData).subscribe((response)=>{

        if(response)
        {
          alert(response.message)
          this.roles = this.roles.filter(role => role !== this.selectedData);
          this.selectedData = '';
           
        }
      },(error)=>{
        alert(error.message)
      });

     
      
    }
    else{
      alert("Select the Role Before Delete")
    }
  }

  // Method to delete Department data
  deleteData1(): void {
    // console.log("rnjfnjnfwkjewjr",this.selectedData)
    if (this.selectedData) {

      this.apicallservice.deleteDepartmentData(sessionStorage.getItem("Organization") as string,this.selectedData).subscribe((response)=>{

        if(response)
        {
          alert(response.message)
          this.departments = this.departments.filter(department => department !== this.selectedData);
            this.selectedData = '';
        }
      },(error)=>{
        alert(error.message)
      });

     
      
    }
    else{
      alert("Select the Department Before Delete")
    }
  }

  // Method to save data
  saveData(): void {
    if (this.newRollData.trim() !== '') {
      this.RolldataItems.push(this.newRollData);
      this.newRollData = ''; // Clear the input field
      this.isDataEntryVisible = false;
    }
  }

  // Method to cancel data entry
  cancelData(): void {
    this.newRollData = '';
    this.isPopupVisible1 = false;
    this.isPopupVisible2 = false;
    this.isPopupVisible3 = false;
    this.isPopupVisible4 = false;
    this.isPopupVisible_dumptype=false;
  }

  // Method to get Roll and department data

  getRolebasedData() {
    this.apicallservice.getRoleDepartmentData(sessionStorage.getItem('Organization') as string).subscribe(
      (response: any) => {
        if (response) {
          // Assuming response has properties Department, Role, and Organization
          this.departments = Array.from(new Set(response.Department));
          this.roles = Array.from(new Set(response.Role));
          this.organizations = Array.from(new Set(response.Organization));
          console.log("::::::",this.roles)
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  
  onSubmit(): void {
    const formData = {
      organization_name: this.organization_name,
      address: this.address,
      pincode: this.pincode,
      state: this.state,
      country: this.country,
      contact: this.contact
    };


if(formData.organization_name && this.address && this.pincode && this.state && this.country  && this.contact){
    this.apicallservice.profileInsert(formData.organization_name,this.address,this.pincode,this.state,this.country,this.contact,sessionStorage.getItem("Organization") as string).subscribe(
      (response: any) => {

      
          

        if(response){
          alert("Profile is uploaded.")
        }
       
        // Clear the form or perform other actions after successful submission
        
      },
      (error: any) => {
        console.error('Error submitting form data:', error);
        // Handle errors here
      }
    );
}
else{
  alert("Please enter all Values")
}


  }



  // Method to close the popup form
  closePopupForm(): void {
    this.isPopupVisible1 = false;
    this.isPopupVisible2 = false;
    this.isPopupVisible3 = false;
    this.isPopupVisible4 = false;
  }

  // Define the openPopupForm methods
  openPopupForm1(): void {
    // this.closePopupForm();
    this.isPopupVisible1 = true;
  }
//department update
  openPopupForm2(): void {

    this.getRolebasedData();

    this.closePopupForm();
    this.isPopupVisible2 = true;
  }
  openPopupFormDump_Usage(): void {

    this.getRolebasedData();

    this.closePopupForm();
    this.isPopupVisible_dumptype = true;
  }
//role update
  openPopupForm3(): void {


    this.getRolebasedData();
    this.closePopupForm();
    this.isPopupVisible3 = true;
  }
//mail automation 
  openPopupForm4(): void {

    
    this.closePopupForm();
    this.isPopupVisible4 = true;
  }
}