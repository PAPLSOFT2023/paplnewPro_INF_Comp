import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  {
  

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

  viewDetails(service: any) {
   // Implement the logic to show service details, e.g., open a modal or navigate to a details page.
    console.log('View details for:', service);
  }
}