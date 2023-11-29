import { Component, OnInit } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspector-home',
  templateUrl: './inspector-home.component.html',
  styleUrls: ['./inspector-home.component.scss']
})
export class InspectorHomeComponent implements OnInit {
  name: string = '';
  recordCount: number = 0;
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
