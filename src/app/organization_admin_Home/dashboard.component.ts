import { Component } from '@angular/core';
import { ApicallService } from '../apicall.service';
import { response } from 'express';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  {

  
constructor(private apicall:ApicallService){
console.log("&&&&&&&&&&&&&&&",sessionStorage.getItem("UserName"));


}

// dataArray: any[] = [
//     { name: '', years: [{year: '', months: [ {   month: '',   dates: [],  },  ],},], },  ];

dataArray: any[] = [];
  services = [
    {
      name: 'Lift_Inspections',
      description: 'Comprehensive inspections for elevators to ensure safety and compliance.',
      imageUrl: 'assets/lift.png',
    },
    {
      name: 'Car_Parking_Systems',
      description: 'Inspecting car parking systems to keep them reliable and efficient.',
      imageUrl: 'assets/carparking.png',
    },
    {
      name: 'Escalator_Inspections',
      description:'Ensuring safe and smooth escalator operation through inspections',
      imageUrl: 'assets/escalator1.png',
    },
    // Add more inspection service objects
  ];

  viewDetails() {
   // Implement the logic to show service details, e.g., open a modal or navigate to a details page.


   this.apicall.leaveData().subscribe((response: any) => {
    console.log(response); // Log the response to the console
    this.dataArray = response;
  });
   
  }
}