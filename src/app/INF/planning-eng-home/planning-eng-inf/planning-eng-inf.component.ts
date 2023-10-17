// import { Component } from '@angular/core';
import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
// import { DialogComponent } from '../dialog/dialog.component';
// import { Dialog2Component } from '../dialog2/dialog2.component';
import { Dialog2Component } from 'src/app/INF/dialog2/dialog2.component';
import { DialogComponent } from 'src/app/INF/dialog/dialog.component';
import { HttpClient } from '@angular/common/http';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApicallService } from 'src/app/apicall.service';
// import { DialogCComponent } from '../dialog-c/dialog-c.component';

@Component({
  selector: 'app-planning-eng-inf',
  templateUrl: './planning-eng-inf.component.html',
  styleUrls: ['./planning-eng-inf.component.css']
})
export class PlanningEngInfComponent {

  selectContract:string|null='';
  public selectedDetails: any = []; // Change this type to match your data structure
  
  // dateObj = this.selectedDetails.customer_workorder_date;
  formattedDate: string = "";

  // formattedDate = dateObj.toISOString().split('T')[0];


  // constructor(private route:ActivatedRoute,private dataService:DataService){ }
  // ngOnInit() {
    // Capture the 'name' parameter from the route and save it to 'selectedName'
    // this.route.paramMap.subscribe(params => {
    //   const encodedValue =  params.get('c_no');

    //   // this.selectContract=decodeURIComponent(decodedValue);
    //   if (encodedValue !== null) {
    //     this.selectContract = decodeURIComponent(encodedValue);
    //   }
      


    //   //api call
    //   this.dataService.getDetailsForContractName(this.selectContract).subscribe((details: any) => {
    //     this.selectedDetails = details;
    //   });
  
    // });

   
   
    
  // }

  store_url='';
  values: string[] = [];
  region_values:string[]=[];
  inspection_type:string[]=[];
  oem:string[]=[];
  travel:string[]=[];
  inspector:string[]=[];
  inspection_time:string[]=[];
  inspection_time_ins:string[]=[];


  //checkbox values
  tpt6:boolean=false;
  tpt7:boolean=false;
  load_test:boolean=false;
  pmt:boolean=false;
  rope_condition:boolean=false;

  //flag for check boxes
  tpt6_flag=0;
  tpt7_flag=0;
  load_test_flag=0;
  pmt_flag=0;
  rope_condition_flag=0;
  
  //functions for asign the checkbox values into flag values

  updatetpt6Flag() {
    this.tpt6_flag = this.tpt6 ? 1 : 0;
  }

  updatetpt7Flag() {
    this.tpt7_flag = this.tpt7 ? 1 : 0;
  }

  updateload_testFlag() {
    this.load_test_flag = this.load_test ? 1 : 0;
  }

  updatepmtFlag() {
    this.pmt_flag = this.pmt ? 1 : 0;
  }

  updaterope_conditionFlag() {
    this.rope_condition_flag= this.rope_condition ? 1 : 0;
  }

  check(){
    console.log('tpt6 flag',this.tpt6_flag);
    console.log('tpt7 flag',this.tpt7_flag);
    console.log('load test flag',this.load_test_flag);
    console.log('pmt flag',this.pmt_flag);
    console.log('rope condition flag',this.rope_condition_flag);
    
    
  }
  //all the values

  contract_number:string='';
  region:string='';
  location:string='';
  pincode:string='';
  master_customer:string='';
  work_order_no:string='';
  customer_name_workorder:string='';
  project_name:string='';
  building_name:string='';
  building_type:string='';
  inspection_type_sync:string='';
  site_address:string='';
  customer_contact_name:string='';
  customer_contact_number:string='';
  customer_contact_mailid:string='';
  //
  oem_details_sync:string='';
  total_number_of_units:number=0;
  travel_expenses_by:string='';
  accomodation_by:string='';
  no_of_visits_as_per_work_order:number=0;
  no_of_mandays_as_per_work_order:number=0;
  inspection_time_sync:string='';
  inspector_name:string='';
  client_whatsapp_number:string='';
  inspection_time_ins_sync:string='';
  scheduleFrom:Date= new Date();
  scheduleTo:Date = new Date();
  work_order_date= new Date();

  //checked items
  // from_date: Date=
 

  








  constructor(private http:HttpClient,private dialog:MatDialog,private dataService:ApicallService,private route:ActivatedRoute,private router:Router){
    
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encodedValue =  params.get('c_no');

      // this.selectContract=decodeURIComponent(decodedValue);
      if (encodedValue !== null) {
        this.selectContract = decodeURIComponent(encodedValue);
      }
      


      //api call
      this.dataService.getDetailsForContractName(this.selectContract).subscribe((details: any) => {
        this.selectedDetails = details;
        const dateObj = new Date(this.selectedDetails.customer_workorder_date);

        // Get the date portion in the "YYYY-MM-DD" format
        this.formattedDate = dateObj.toISOString().split('T')[0];
        this.dataService.selectedDetails=this.selectedDetails;

      });

  
    });
  


    const apiUrl = 'http://localhost:3000/api/building_type';
    const apiUrl_for_region = 'http://localhost:3000/api/region';
    const inspection_type = 'http://localhost:3000/api/inspection_type';
    const oem = 'http://localhost:3000/api/oem';
    const travel = 'http://localhost:3000/api/travel';
    const inspector='http://localhost:3000/api/inspector';
    const inspection_time ='http://localhost:3000/api/inspection_time';
    const inspection_time_ins ='http://localhost:3000/api/inspection_time_ins';

    
    this.http.get<string[]>(apiUrl).subscribe((data) => {
      this.values = data;
    });

    this.http.get<string[]>(apiUrl_for_region).subscribe((data) => {
      this.region_values = data;
      console.log(data);
      
    });

    this.http.get<string[]>(inspection_type).subscribe((data) => {
      this.inspection_type = data;
      console.log(data);
      
    });
    this.http.get<string[]>(oem).subscribe((data) => {
      this.oem = data;
      console.log(data);
      
    });

    this.http.get<string[]>(travel).subscribe((data) => {
      this.travel = data;
      console.log(data);
      
    });
    this.http.get<string[]>(inspector).subscribe((data) => {
      this.inspector = data;
      console.log(data);
      
    });

    this.http.get<string[]>(inspection_time).subscribe((data) => {
      this.inspection_time = data;
      console.log(data);
      
    });

    this.http.get<string[]>(inspection_time_ins).subscribe((data) => {
      this.inspection_time_ins = data;
      console.log(data);
      
    });
  
  
  }
  // openDialog(){
  //   const dialogRef = this.dialog.open(DialogComponent,{restoreFocus:false});
  //   dialogRef.afterClosed().subscribe(()=>{
  //     const dialog2 = this.dialog.open(Dialog2Component,{restoreFocus:false});
  //     dialog2.afterClosed().subscribe(()=>{
  //       alert('this dialog has been closed.');
  //     });
  //   });
  // }
  openDialog(){
    const dialogRef = this.dialog.open(Dialog2Component,{restoreFocus:false});
    dialogRef.afterClosed().subscribe(()=>{
      // alert('this dialog has been closed.');
    });
  }

openDialog1(){
  const dialogRef = this.dialog.open(DialogComponent,{restoreFocus:false});
  dialogRef.afterClosed().subscribe(()=>{
    // alert('this dialog has been closed.');
    });
  }
  title = 'inf_26_doc';
  // onSubmit() {
  //   const store_values={contract_number:this.contract_number,region:this.region,location:this.location};

  //   this.http.post('http://localhost:3000/api/store_data', this.store_values).subscribe(
  //     (response) => {
  //       console.log('details stored successfully');
  //       // Handle success (e.g., redirect to a login page)
  //     },
  //     (error) => {
  //       console.error('Error stored details: ' + error);
  //       // Handle error (e.g., display an error message)
  //     }
  //   );
  // }
  check1(){
    console.log(this.scheduleFrom);
    console.log(this.tpt6_flag);
    console.log(this.tpt7_flag);
    console.log(this.rope_condition_flag);
    console.log(this.pmt_flag);
    console.log(this.load_test_flag);
    console.log(this.client_whatsapp_number);
    
    
    
    
    
    
    
  //   elevator_names:string[]=[]; //1
  // elevator_usage:string[]=[];
  // elevator_type:string[]=[];
  // elevator_stops:number[]=[];
  // home_names:string[]=[]; //2
  // home_usage:string[]=[];
  // home_type:string[]=[];
  // home_stops:number[]=[];
  // dump_names:string[]=[]; //3
  // dump_usage:string[]=[];
  // dump_type:string[]=[];
  // dump_stops:number[]=[];

  // total_count:number=0;
  // hydra_elevator:number=0;
  // dumb_waiter:number=0;
  // car_parking:number=0;
  // escalator:number=0;
  // moving_walk:number=0;
  // travelator:number=0;

    
  }

  onSubmit() {
    //elevators
    const elevator_names=this.dataService.elevator_names;
    const elevator_type=this.dataService.elevator_type;
    const elevator_stops = this.dataService.elevator_stops;
    const elevator_usage=this.dataService.elevator_usage;
    const elevator={elevator_names,elevator_type,elevator_stops,elevator_usage};

    //home elevator
    const home_names = this.dataService.home_names;
    const home_stops = this.dataService.home_stops;
    const home_type = this.dataService.home_type;
    const home_usage = this.dataService.home_usage;
    const home_elevator = {home_names,home_stops,home_type,home_usage};

    //dumb waiter
      const dump_names=this.dataService.dump_names;
      const dump_stops = this.dataService.dump_stops;
      const dump_type = this.dataService.dump_type;
      const dump_usage = this.dataService.dump_usage;
      const dump_elevator={dump_names,dump_stops,dump_type,dump_usage};
    
    const checkedCount=this.dataService.getCheckedCount();
    const checked_items_values=this.dataService.total_checked_items;
    const uncheckedCount=this.dataService.unCheckedCount;
    const uncheckedItems = this.dataService.total_unchecked_items;
    const total_items=this.dataService.total_items;
    const no_of_elevator=this.dataService.total_count;
    const no_of_stops_elevator = this.dataService.calculateSum();
    const no_of_travelator = this.dataService.travelator;
    const no_of_mw= this.dataService.moving_walk;
    const no_of_dw = this.dataService.dumb_waiter;
    const no_of_stops_dw = this.dataService.calculateSum2();
    const no_of_home_elevator = this.dataService.hydra_elevator;
    const no_of_stops_home_elevator = this.dataService.calculateSum1();
    const car_parking_values =this.dataService.car_parking_values;
    const escalator_values = this.dataService.escalator_values;
    const mw_values = this.dataService.moving_walk_values;
    const travelator_values = this.dataService.travelator_values;

    const no_of_car_parking = this.dataService.car_parking;

    const no_of_escalator = this.dataService.escalator;
    
    console.log('items',checked_items_values);
    
    console.log('value from service',checkedCount);
    
    
    const store_values = {
      // contractNumber: this.selectedDetails.contract_number,
      // checked_count:checkedCount,
      // checked_items:checked_items_values,
      // unchecked_count:uncheckedCount,
      // unchecked_items:uncheckedItems,
      // total_items:total_items,
      // total_units_schedule:checkedCount,
      // balance_to_inspect:uncheckedCount,
      // inspector_name:this.inspector_name,
      // inspection_time_ins:this.inspection_time_ins_sync,
      // schedule_from : this.scheduleFrom,
      // schedule_to : this.scheduleTo,

      elevator_values:elevator, 
      home:home_elevator, 
      dump:dump_elevator, 
      oem_details:this.oem_details_sync, 
      total_number_of_units:this.total_number_of_units, 
      no_of_elevator:no_of_elevator, 
      no_of_stops_elevator:no_of_stops_elevator, 
      no_of_escalator:no_of_escalator, 
      no_of_travelator:no_of_travelator, 
      no_of_mw:no_of_mw, 
      no_of_dw:no_of_dw, 
      no_of_stops_dw:no_of_stops_dw, 
      no_of_home_elevator:no_of_home_elevator, 
      no_of_stops_home_elevator:no_of_stops_home_elevator, 
      no_of_car_parking:no_of_car_parking, 
      car_parking_values:car_parking_values, 
      escalator_values:escalator_values, 
      mw_values:mw_values, 
      travelator_values:travelator_values, 
      contractNumber: this.selectedDetails.contract_number,






      
      

      
    };

    this.http.put('http://localhost:3000/api/update_data1', store_values).subscribe(
      (response) => {
        console.log('Data stored successfully', response);
        const successMessage = 'Success...!';
        const userConfirmation = window.confirm(successMessage);
        if(userConfirmation){
          this.router.navigate(['/plan_eg_home']);
        }
      },
      (error) => {
        console.error('Error storing data', error);
      }
    );
  }

}
