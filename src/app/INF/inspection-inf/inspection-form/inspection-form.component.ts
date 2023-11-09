import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { DataService } from 'src/app/data.service';
import { ApicallService } from 'src/app/apicall.service';
import { MatDialog } from '@angular/material/dialog';
// import { DialogComponent } from '../dialog/dialog.component';
// import { Dialog2Component } from '../dialog2/dialog2.component';
import { Dialog2Component } from 'src/app/INF/dialog2/dialog2.component';
import { DialogComponent } from 'src/app/INF/dialog/dialog.component';
import { HttpClient } from '@angular/common/http';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogCComponent } from '../dialog-c/dialog-c.component';
import { CalenderComponent } from '../calender/calender.component';
import { MultipleInspectorComponent } from '../multiple-inspector/multiple-inspector.component';

@Component({
  selector: 'app-inspection-form',
  templateUrl: './inspection-form.component.html',
  styleUrls: ['./inspection-form.component.css']
})
export class InspectionFormComponent implements OnInit {
  selectContract:string|null='';
  public selectedDetails: any = []; // Change this type to match your data structure
  
  // dateObj = this.selectedDetails.customer_workorder_date;
  formattedDate: string = "";
  encodedValue:string='';






  store_url='';
  values: string[] = [];
  region_values:string[]=[];
  inspection_type:string[]=[];
  oem:string[]=[];
  travel:string[]=[];
  inspector:string[]=[];
  inspection_time:string[]=[];
  inspection_time_ins:string[]=[];
  inspector_type:string[]=[];

  dataArray1:any[]=[];


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
  no_of_breakdays:string = '';
  inspectorType: string ='Single Inspector';


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
        console.log(this.selectedDetails);
        

      });

      const inspector=`http://localhost:3000/api/inspector?encodedValue=${encodedValue}`;


      this.http.get<string[]>(inspector).subscribe((data) => {
        this.inspector = data;
        console.log(data);
   
      this.dataService.inspector_names=this.inspector;

      // }
      },error=>{
        console.error(error);
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
    const inspector_type_url ='http://localhost:3000/api/inspector_type';


    
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

    this.http.get<string[]>(inspector_type_url).subscribe((data) => {
      this.inspector_type = data;
      console.log(data);
      
    });

    this.dataService.leaveData().subscribe((response: any) => {
      console.log('leave datas are '+response); // Log the response to the console
      this.dataArray1 = response;
    });
    
    
    // const queryParams = `?oem=${ins_json.oem}&oem_location=${ins_json.oem_location}`;

    // const queryParams='';

    
    
   
    

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
    const dialogRef = this.dialog.open(DialogCComponent,{restoreFocus:false});
    dialogRef.afterClosed().subscribe(()=>{
      // alert('this dialog has been closed.');
      if (this.selectedDetails && this.selectedDetails.oem_details && this.selectedDetails.location) {
        const ins_json = {
          oem: this.selectedDetails.oem_details,
          oem_location: this.selectedDetails.location
        };
        console.log("oem data"+ins_json.oem);
        
    
        // Construct the query parameters and make the HTTP request...
      } else {
        console.error('Invalid or undefined values for oem_details or location.');
      }
    });
  }

openDialog1(){
 
  const dialogRef = this.dialog.open(DialogComponent,{restoreFocus:false});
  dialogRef.afterClosed().subscribe(()=>{
    // alert('this dialog has been closed.');
    });
  }


openDialog2(){
 
  const dialogRef = this.dialog.open(MultipleInspectorComponent,{restoreFocus:false});
  dialogRef.afterClosed().subscribe(()=>{
    // alert('this dialog has been closed.');
    });
  }


openDialog3(){
 
  const dialogRef = this.dialog.open(CalenderComponent,{restoreFocus:false});
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
  fetchData(){
    const inspector='http://localhost:3000/api/inspector';


    if (this.dataService.selectedDetails && this.dataService.selectedDetails.oem_details && this.dataService.selectedDetails.location) {
      const ins_json = {
        oem: this.dataService.selectedDetails.oem_details,
        oem_location: this.dataService.selectedDetails.location
      };
      console.log("oem data"+ins_json.oem);
      
  
      // Construct the query parameters and make the HTTP request...
    } else {
      console.error('Invalid or undefined values for oem_details or location.');
    }

    const oem_data = this.dataService.selectedDetails.oem_details;
    
    console.log('oem details are '+oem_data);
    
    
    
    this.http.get<string[]>(inspector).subscribe((data) => {
      this.inspector = data;
      console.log(data);
      
    },error=>{
      console.error(error);
    });

  }
  check1(){
    const inspector_list = this.dataService.inspector_list;
    inspector_list.push(this.inspector_name);
    console.log(inspector_list);


    

    
    
    
    
    
    
    
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

  ngAfterViewInit(){
   

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


    const no_of_car_parking = this.dataService.car_parking;

    const no_of_escalator = this.dataService.escalator;

    const inspector_list = this.dataService.inspector_list;

    const inspector_array = this.dataService.inspector_array;

    inspector_list.push(this.inspector_name);
    console.log('items',checked_items_values);
    
    console.log('value from service',checkedCount);
    
    
    const store_values = {
      contractNumber: this.selectedDetails.contract_number,
      checked_count:checkedCount,
      checked_items:checked_items_values,
      unchecked_count:uncheckedCount,
      unchecked_items:uncheckedItems,
      total_items:total_items,
      total_units_schedule:checkedCount,
      balance_to_inspect:uncheckedCount,
      inspector_name:inspector_list,
      inspection_time_ins:this.inspection_time_ins_sync,
      schedule_from : this.scheduleFrom,
      schedule_to : this.scheduleTo,
      i_status:1,
      no_of_breakdays:this.no_of_breakdays,
      inspector_array:inspector_array





      
      

      
    };


    this.http.put('http://localhost:3000/api/update_data', store_values).subscribe(
      (response) => {
        console.log('Data stored successfully', response);
        const successMessage = 'Inspection is initialized successfully. Please use the shortcut key Ctrl+P to download this document';
        const userConfirmation = window.confirm(successMessage);
        if(userConfirmation){
          console.log("Called..*******",this.selectedDetails.contract_number)
          this.router.navigate(['pdf',this.selectedDetails.contract_number]);
        }
      },
      (error) => {
        console.error('Error storing data', error);
      }
    );

    
  }

}
