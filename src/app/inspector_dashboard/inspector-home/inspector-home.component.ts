import { Component } from '@angular/core';
import { ApicallService } from 'src/app/apicall.service';

@Component({
  selector: 'app-inspector-home',
  templateUrl: './inspector-home.component.html',
  styleUrls: ['./inspector-home.component.scss']
})
export class InspectorHomeComponent {

  
  name:string="";

  constructor(private apicallservice:ApicallService){}
  ngOnInit(){
    this.name=sessionStorage.getItem("UserName") as string
    console.log("------", this.name)
    this.get_Insp_Name_List()
  }

  get_Insp_Name_List(){
    this.apicallservice.get_Insp_Name_List().subscribe(
      (response: any[]) => {
        if (response) {
          
       console.log("@@@@",response);


        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }



}
