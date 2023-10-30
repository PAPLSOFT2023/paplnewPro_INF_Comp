import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import{Observable}from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApicallService {
  private apiURLCommon='http://localhost:3000/';
  private apiURL=this.apiURLCommon+'api/';

  constructor(private httpClient:HttpClient) { }
  // this func for load customerdata

generatePDF():Observable<any>{
  console.log("wsdef")
  // this.httpClient.get(this.apiURL+"generate-pdf");
  return this.httpClient.get(this.apiURL+"generatepdf");
}



profileInsert(organization_name:string,address:string,pincode:string,state:string,country:string,contact:string,organization:string):Observable<any>{
    const body={organization_name,address,pincode,state,country,contact,organization}

console.log("api Called",organization_name,address,pincode,state,country,contact,organization)
  return this.httpClient.post(this.apiURL+"profileInsert",body);
}






deleteLoginDetails(email: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // Pass email in the request body
  const bodyValue = { email: email };

  return this.httpClient.delete(this.apiURL + 'adminregister_login_delete', { headers, body: bodyValue });
}



  updateLoginData(email:string,organization:string,role:String,lstatus:number,authenticator:string,username:string,emailverified:number,existingmail:string,department:string):Observable<any>
  {

    // console.log(email,organization,role,lstatus,authenticator,username,emailverified,existingmail)
    const body_update={email,organization,role,lstatus,authenticator,username,emailverified,existingmail,department}
    

    return this.httpClient.put(this.apiURL+'adminregister_login_update',body_update);
  }


  deleteRoleData(organization: string, role: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.delete(`${this.apiURL}Role_Data_Delete`, { headers, body: { organization, role } });
  }


  
  deleteDepartmentData(organization: string, department: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.delete(`${this.apiURL}Department_Data_Delete`, { headers, body: { organization, department } });
  }
  
  getLoginData():Observable<any>{
    

 return this.httpClient.get(this.apiURL+'loginData');
  }



  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    console.log("**** API Called")
    return this.httpClient.post(this.apiURL+'login', body);
  }

  adminregister(userid:string, password:string, organization:string, role:String,status:number,authenticator:string,name:string,statusnum:number,department:string):Observable<any>{
    const body={userid,password,organization,role,status,authenticator,name,statusnum,department};
    return this.httpClient.post(this.apiURL+'adminregister',body);

  }

  // getrole(username: string): Observable<any> {
  //   const body = { username };
  //   return this.httpClient.post(this.apiURL+'getrole', body);
  // }

 addData(data:any):Observable<any>
 {
  return this.httpClient.post(this.apiURL+'addRoleData',data);
 }


 getRoleDepartmentData(organization:string):Observable<any>
 {
  const url = `${this.apiURL}getRoleData`;
    const params = new HttpParams().set('organization', organization);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      params: params
    };

    return this.httpClient.get(url, options);
  }

  InsertDepartmentData(Department:string,Organization:string):Observable<any>
  {

    const body={Department,Organization};


    return this.httpClient.post(this.apiURL+"InsertDepartmentData",body) ;
  }
  InsertRoleData(Role:string,Organization:string):Observable<any>
  {

    const body={Role,Organization};


    return this.httpClient.post(this.apiURL+"InsertRoleData",body) ;
  }































  // INF

  selectedDetails:string[] | any=[];
  

  private contract_no = this.apiURLCommon+'contract_no';

  private contract_no1 = this.apiURLCommon+'contract_no1';
  
  //to display contract number 
  getContractNo(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.contract_no);
  }

  getContractNo1(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.contract_no1);
  }

  getDetailsForContractName(c_no: string|null): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:3000/details/${c_no}`);
  }


  total_count:number=0;
  hydra_elevator:number=0;
  dumb_waiter:number=0;
  car_parking:number=0;
  escalator:number=0;
  moving_walk:number=0;
  travelator:number=0;

  //elevator
  elevator_names:string[]=[]; //1
  elevator_usage:string[]=[];
  elevator_type:string[]=[];
  elevator_stops:number[]=[];
  elevator_stops_count:number=0;

  calculateSum(): number {
    return this.elevator_stops.reduce((acc, currentValue) => acc + currentValue, 0);
  }
  

  //home elevator
  home_names:string[]=[]; //2
  home_usage:string[]=[];
  home_type:string[]=[];
  home_stops:number[]=[];
  

  calculateSum1(): number {
    return this.home_stops.reduce((acc, currentValue) => acc + currentValue, 0);
  }


  //dump waiter
  dump_names:string[]=[]; //3
  dump_usage:string[]=[];
  dump_type:string[]=[];
  dump_stops:number[]=[];

  // all_items=[...this.elevator_names,...this.home_names,...this.dump_names];

  calculateSum2(): number {
    return this.dump_stops.reduce((acc, currentValue) => acc + currentValue, 0);
  }

  //car parking
  car_parking_values:string[]=[];


  //escalator
  escalator_values:string[]=[];


  //moving_walk
  moving_walk_values:string[]=[];


  //travelator
  travelator_values:string[]=[];


  //total_checked_items
  total_checked_items:string[]=[];
  
  checkedCount:number=0;

  //unchecked counts

  total_unchecked_items:string[]=[];
  unCheckedCount:number=0;


  //total items
  total_items:string[]=[];
  
  // Method to set the checkedCount in the DataService
  setCheckedCount(count: number) {
    this.checkedCount = count;
  }

  // Method to get the checkedCount from the DataService
  getCheckedCount() {
    return this.checkedCount;
  }


}
