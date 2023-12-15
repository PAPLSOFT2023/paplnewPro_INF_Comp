import { Component, OnInit } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute,Router } from '@angular/router';
import { response } from 'express';
import * as fs from 'fs';

@Component({
  selector: 'app-inspector-home',
  templateUrl: './inspector-home.component.html',
  styleUrls: ['./inspector-home.component.scss']
})
export class InspectorHomeComponent implements OnInit {
  name: string = '';
  recordCount: number = 0;
  records:any[]=[];
  scheduleBool:boolean=false;

  open_pupUp=false
  isGetInfDataEnabled: boolean = false;
  isGetInspectorDataEnabled: boolean = false;
  isGetMailSetupEnabled: boolean = false;
  isSendingMailEnabled: boolean = false;
  isMailReportEnabled: boolean = false;


  location:string='/assets/logo1.png'

  constructor(private apicallservice: ApicallService, private http: HttpClient,private router:Router) {}

  ngOnInit() {
    

   
    this.scheduleBool=false
    this.name = sessionStorage.getItem('UserName') as string;
    console.log('------', this.name);
    this.getRecordCount(this.name);
    this.getRecordCount1(this.name);
    
  }




  redirectSchedule(){
    this.scheduleBool=true;
    this.router.navigate(['/afterlogin/inspectorHome/schedule_page']);
    // this.router.navigate( [{ outlets: { scheduleOutlet: ['inspectorHome', 'schedule_page'] } }],{ relativeTo: this.route.parent } );
    // this.router.navigate(['/afterlogin', { outlets: { scheduleOutlet: ['schedule_page'] } }]);

    // this.router.navigate([{ outlets: { scheduleOutlet: ['schedule_page'] } }]);
   
  }

  getRecordCount(name: string) {
    const params = new HttpParams().set('name', name);

    this.http.get<number>('http://localhost:3000/api/countRecords', { params })
      .subscribe(
        count => {
          this.recordCount = count;
        },
        error => {
          console.error('Error fetching record count:', error);
        }
      );
  }


  Send_Mail_Client(id:string){


    this.open_pupUp=true;
    // console.log(id);
    // const sender=sessionStorage.getItem("Email") as string
    if(id){
      this.apicallservice.getinfdata_forMail(id).subscribe(
        (response: any) => {
        if (response && response.length !== 0) {

         this. isGetInfDataEnabled = true;
  
          console.log("INF====>",response,"\n")
         this.apicallservice.getInspectorData(response[0].inspector_list).subscribe((inspector_data:any)=>{
          if(inspector_data)
          {


          
               this.isGetInspectorDataEnabled = true;
  
            console.log("Inspector Data====>",inspector_data,"\n")
            const inspvalue = inspector_data.map((jsonObject: Record<string, any>) =>
            Object.entries(jsonObject).flat()
          );

          const getEmailFromData = (dataArray: any[]): string | undefined => {
            const emailIndex = dataArray.indexOf('email_id');
            if (emailIndex !== -1 && emailIndex < dataArray.length - 1) {
              return dataArray[emailIndex + 1];
            }
            return undefined;
          };
          
          const emailArray: string[] = [];
          
          for (const personData of inspvalue) {
            // Check if personData is an array before processing
            if (Array.isArray(personData)) {
              const email = getEmailFromData(personData);
              if (email) {
                emailArray.push(email);
              }
            }
          }
          
         

            this.apicallservice.getMail_Setup("papl").subscribe((sender_Details:any)=>{
              if(sender_Details)
              {
                
                console.log("sender Data====>",sender_Details,"\n")

               
               this.isGetMailSetupEnabled = true;

  
                    const inspector_Data = inspector_data.map((jsonObject: Record<string, any>) =>
                    Object.entries(jsonObject).flat()
                  );

                    console.log("88", inspector_Data);

                    
                    this.apicallservice.send_mail_to_client(
                      response[0].master_customer_name,
                      response[0].total_units_schedule,
                      response[0].project_name,
                      response[0].location,
                      response[0].contract_number,
                      response[0].customer_workorder_name+","+response[0].customer_workorder_date,
                      response[0].schedule_from,
                      response[0].schedule_to,
                      response[0].no_of_mandays_as_per_work_order,
                      response[0].type_of_inspection,
                      response[0].inspection_time_ins,
                      response[0].customer_contact_mailid,
                      emailArray,
                      inspector_Data,
                      sender_Details[0].App_password,
                      sender_Details[0].Email,
                      response[0].inspector_list
                      ).subscribe((mailStatus:any)=>{

                      if(mailStatus){
                        console.log("///",mailStatus)

                        
                       this. isMailReportEnabled = true;
                      }
                     
                    },(error:any)=>{

                    })
                  }
            },(error:any)=>{

            })
          }

         },(error:any)=>{

         })
        }
        else{
        }

       },
       (error:any)=>{

       }
      );
    }
    else{
      alert("error ")
    }

  }








  getRecordCount1(name: string) {
    const params = new HttpParams().set('name', name);

    this.http.get<any>('http://localhost:3000/api/countRecords2', { params })
      .subscribe(
        count => {
            this.records = count;
        },
        error => {
          console.error('Error fetching record count:', error);
        }
      );
  }

  pdf(no:string){
    
    // const successMessage = 'Click ok to view the document';
    // const userConfirmation = window.confirm(successMessage);
    // if(userConfirmation){
    //   console.log("Called..*******",no)
      this.router.navigate(['pdf',no]);
    // }
    // this.router.navigate(['pdf',no]);


  }

 
}
