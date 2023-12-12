import { Component , Inject} from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-rejection',
  templateUrl: './rejection.component.html',
  styleUrls: ['./rejection.component.scss']
})
export class RejectionComponent {
  request: any;
  selectedReason: string=''; // Variable to hold the selected reason


  constructor(private http:HttpClient,public dialogRef: MatDialogRef<RejectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
      this.request = data.request; 
      console.log('parameter value is',this.request);
      


  }

  reject(){
    const params = new HttpParams().set('id', this.request.toString()).set('reason', this.selectedReason.toString()); // Convert id to string
    // console.log(id);

  
    this.http.put<any>('http://localhost:3000/api/approveRecords3', {}, { params }) // Include empty object as body
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

  
  

 


  rejectionReasons: string[] = [];
  ngOnInit(){
    const inspection_time_ins ='http://localhost:3000/api/rejection';
    this.http.get<string[]>(inspection_time_ins).subscribe((data) => {
      this.rejectionReasons = data;
    });

  }



}
