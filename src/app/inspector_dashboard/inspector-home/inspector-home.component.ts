import { Component, OnInit } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-inspector-home',
  templateUrl: './inspector-home.component.html',
  styleUrls: ['./inspector-home.component.scss']
})
export class InspectorHomeComponent implements OnInit {
  name: string = '';
  recordCount: number = 0;

  constructor(private apicallservice: ApicallService, private http: HttpClient) {}

  ngOnInit() {
    this.name = sessionStorage.getItem('UserName') as string;
    console.log('------', this.name);
    this.getRecordCount(this.name);
    this.get_Insp_Name_List();
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
