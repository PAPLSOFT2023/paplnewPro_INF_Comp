import { Component } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent {
  name: string = '';
  records:any[]=[];
  scheduleBool:boolean=false;

  constructor(private apicallservice: ApicallService, private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.scheduleBool=false
    this.name = sessionStorage.getItem('UserName') as string;
    console.log('------', this.name);
    this.getRecordCount(this.name);
    this.get_Insp_Name_List();
  }




  redirectSchedule(){
    this.scheduleBool=true;
    this.router.navigate(['/afterlogin/inspectorHome/schedule_page']);
   
  }

  getRecordCount(name: string) {
    const params = new HttpParams().set('name', name);

    this.http.get<any>('http://localhost:3000/api/countRecords1', { params })
      .subscribe(
        count => {
            this.records = count;
        },
        error => {
          console.error('Error fetching record count:', error);
        }
      );
  }
  // approveRequest(id:number){
  //   const params = new HttpParams().set('id',id );
  //   console.log(id);
    

  //   this.http.put<any>('http://localhost:3000/api/approveRecords', { params })
  //     .subscribe(
  //       count => {
  //           // this.records = count;
  //           console.log('successful');
  //           alert("successful...!")
            
  //       },
  //       error => {
  //         console.error('Error fetching record count:', error);
  //       }
  //     );

  // }
  approveRequest(id: number) {
    const params = new HttpParams().set('id', id.toString()); // Convert id to string
    console.log(id);
  
    this.http.put<any>('http://localhost:3000/api/approveRecords', {}, { params }) // Include empty object as body
      .subscribe(
        count => {
          // this.records = count;
          console.log('successful');
          alert('Successful...!');
        },
        error => {
          console.error('Error approving record:', error);
        }
      );
  }
  
  get_Insp_Name_List() {
    this.apicallservice.get_Insp_Name_List().subscribe(
      (response: any[]) => {
        if (response) {
          console.log('@@@', response);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
