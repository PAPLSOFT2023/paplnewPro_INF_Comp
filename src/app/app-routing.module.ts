import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NeworganizationComponent } from './neworganization/neworganization.component';
import { AfterloginComponent } from './afterlogin/afterlogin.component';
import { OrganizationUserManagementComponent } from './organizationadmin/organization-user-management/organization-user-management.component';
import { DashboardComponent } from './organizationadmin/organization_admin_Home/dashboard.component';
import { SoftwareAdminDashboardComponent } from './softwareadmin/software-admin-dashboard/software-admin-dashboard.component';
import { UiElementsComponent } from './organizationadmin/ui-elements/ui-elements.component';
import { AppHomeComponent } from './app-home/app-home.component';
import { LogindetailManageComponent } from './softwareadmin/software-admin-dashboard/software-admin-user-manage/logindetail-manage/logindetail-manage.component';
import { ProfiledetailManageComponent } from './softwareadmin/software-admin-dashboard/software-admin-user-manage/profiledetail-manage/profiledetail-manage.component';
import { SalesFormComponent } from './INF/sales/sales-form/sales-form.component';
import { SoftwareAdminUserManageComponent } from './softwareadmin/software-admin-dashboard/software-admin-user-manage/software-admin-user-manage.component';
import { InspectionInfComponent } from './INF/inspection-inf/inspection-inf.component';
import { InspectionFormComponent } from './INF/inspection-inf/inspection-form/inspection-form.component';
import { SalesHomeComponent } from './INF/sales/sales-home/sales-home.component';
import { SalesVComponent } from './INF/sales/sales-v/sales-v.component';
import { PlanningEngHomeComponent } from './INF/planning-eng-home/planning-eng-home.component';
import { PlanningEngInfComponent } from './INF/planning-eng-home/planning-eng-inf/planning-eng-inf.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ServicesComponent } from './services/services.component';
import { MailComponent } from './mail/mail.component';
import { InfPdfComponent } from './INF/inf-pdf/inf-pdf.component';
import { InspectorHomeComponent } from './inspector_dashboard/inspector-home/inspector-home.component';
import { ScheduledWorkComponent } from './scheduled-work/scheduled-work.component';
//import { SchedulePageComponent } from './inspector_dashboard/schedule-page/schedule-page.component';
import { MailAutomationInspComponent } from './inspector_dashboard/mail-automation-insp/mail-automation-insp.component';
import { ConfirmPageComponent } from './confirm-page/confirm-page.component';
import { SchedulePageComponent } from './inspector_dashboard/schedule-page/schedule-page.component';
import { RescheduleRequestComponent } from './INF/inspection-inf/reschedule-request/reschedule-request.component';
import { MailResponseComponent } from './mail-response/mail-response.component';
const routes: Routes = [

  {path:'app-home',component:AppHomeComponent,},
  {path:'pdf/:c_no',component:InfPdfComponent},
  {path:"",redirectTo:"app-home",pathMatch:'full'},
  {path: "services",component:ServicesComponent}, 
  {path:"login",component:LoginComponent},
  {path:"Mail_Response",component:MailResponseComponent},
  {path:"neworganization", component:NeworganizationComponent},
  {path:"forgotpassword",component:ForgotpasswordComponent},
  // '/afterlogin/software_admin_dashboard_user_manage/organization_admin_login_details'
  {path: 'afterlogin',component: AfterloginComponent,
    children: [
      
   
        {path:'mail',component:MailComponent},
        {path:'confirm-page',component:ConfirmPageComponent},
        {path:'software_admin_dashboard', component:SoftwareAdminDashboardComponent},
        {path:'software_admin_dashboard_user_manage', component:SoftwareAdminUserManageComponent,
        
        children:[
          {path:'organization_admin_login_details', component:LogindetailManageComponent},
          {path:'',redirectTo:'organization_admin_login_details',pathMatch:'full'},
          
          
        ]},
        // organization admin
        {path: 'dashboard', component: DashboardComponent},//home
        {path:'organization_adminUI', component:UiElementsComponent},// add elements
        {path:'app-organization-user-management',component:OrganizationUserManagementComponent},
        {path:'profile-manage',component:ProfiledetailManageComponent},


        // Inspector
        {path:"inspectorHome",component:InspectorHomeComponent,
            children:[
            {path:'schedule_page',component:SchedulePageComponent},
            ]},
        {path:'scheduledWork', component:ScheduledWorkComponent},
        {path:"mail_automation",component:MailAutomationInspComponent},
       

        
         {path:'inspection_home', component:InspectionInfComponent},
         {path:'RescheduleRequest',component:RescheduleRequestComponent},

         {path:'inspection_inf/:c_no',component:InspectionFormComponent},
         {path:'sales_home',component:SalesHomeComponent},
         {path:'sales_inf/:selectedOption', component:SalesFormComponent},
         {path:'sales_v/:selectedOption',component:SalesVComponent},
         {path:'plan_eg_home',component:PlanningEngHomeComponent },
         {path:'plan_eng_inf/:c_no',component:PlanningEngInfComponent},
         {path:'pdf/:c_no',component:InfPdfComponent}
         
    ],
  },
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
