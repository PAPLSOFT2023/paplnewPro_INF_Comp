import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApicallService } from '../apicall.service';
@Component({
  selector: 'app-mail-response',
  templateUrl: './mail-response.component.html',
  styleUrls: ['./mail-response.component.scss']
})
export class MailResponseComponent {
  id: string='';
  

  constructor(private route: ActivatedRoute,private apicallservice:ApicallService) {}

  ngOnInit(): void {
    // Read the 'id' parameter from the URL
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
  }
  showRejectionPopup = false;
  rejectionReason = '';

  showPopup() {
    alert('okay accepted!');
  }

  showRejection() {
    this.showRejectionPopup = true;
  }

  closeRejection() {
    this.showRejectionPopup = false;
  }

  submitRejection() {
    // Add logic to submit rejection
    console.log('Rejection reason:', this.rejectionReason);
    this.closeRejection();
    if (this.rejectionReason.length === 200) {
      console.log('Rejection reason:', this.rejectionReason);
      this.closeRejection();
    } else {
      alert('Please enter exactly 200 characters for the rejection reason.');
    }
  }
    
  }
