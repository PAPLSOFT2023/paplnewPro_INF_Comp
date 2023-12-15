import { INavbarData } from "./helper";

export const SalesNav: INavbarData[] = [
    {
        routeLink: '/afterlogin/sales_home',
        icon: 'fal fa-home',
        label: 'Home'
    },
   
    
    
];
export const Inspection_Head_Nav: INavbarData[] = [
    {
        routeLink: '/afterlogin/inspection_home',
        icon: 'fal fa-home',
        label: 'Home'
    },
   
    
   
    
];
export const Planning_Engineering_Nav: INavbarData[] = [
    {
        routeLink: '/afterlogin/plan_eg_home',
        icon: 'fal fa-home',
        label: 'Home'
    },
   

   
    
];

export const navbarDataAdmin: INavbarData[] = [
    {
        routeLink: '/afterlogin/software_admin_dashboard',
        icon: 'fal fa-home',
        label: 'Home'
    },
   
    {
        routeLink: '/afterlogin/software_admin_dashboard_user_manage',
        icon: 'fal fa-user',
        label: 'User Management'
    },
    
    {
        routeLink: 'pages',
        icon: 'fal fa-file',
        label: 'pages'
    },
    {
        routeLink: 'media',
        icon: 'fal fa-camera',
        label: 'admin'
    },
    
];

export const oragizationadmin: INavbarData[] = [
    {
        routeLink: '/afterlogin/dashboard',
        icon: 'fal fa-home',
        label: 'Home'
    },
    {
        routeLink: '/afterlogin/organization_adminUI',
        icon: 'fal fa-edit',
        label: 'Setup Data'
    },
    {
        routeLink: '/afterlogin/mail',
        icon: 'fal fa-edit',
        label: 'mail'

    },
    {
        routeLink: '/afterlogin/confirm-page',
        icon: 'fal fa-edit',
        label: 'confirm_page'

    },
   
    {
        routeLink: '/afterlogin/app-organization-user-management',
        icon: 'fal fa-user',
        label: 'Setup Users',
        items: [
            {
                routeLink: '/afterlogin/app-organization-user-management',
                icon: 'fal fa-user',
                label: 'Login Details',
            },
            {
                routeLink: '/afterlogin/profile-manage',
                icon: 'fal fa-user',
                label: 'Profile Details',

            },
        ]
    },
];



export const inspector: INavbarData[] = [
    {
        routeLink: '/afterlogin/inspectorHome',
        icon: 'fal fa-home',
        label: 'Home'
    },
    {
        routeLink: '/afterlogin/scheduledWork',
        icon: 'fal fa-edit',
        label: 'Scheduled Work'
    },
    {
        routeLink: '/afterlogin/mail_automation',
        icon: "fa fa-envelope",
        label: 'Mail'
    },
   
   
];





export function getNavbarData(User: String): INavbarData[] {
console.log("**&&&&&&&&"+User)

    if(User=="Softwareadmin"){
        // console.log("________")
        return  navbarDataAdmin;
    }
    else if(User=="Organization Admin")
     {
        // console.log("++++++++++")
     return oragizationadmin;
     }
     else if(User.toLowerCase()=="sales")
     {
        // console.log("---------")
        return SalesNav;
     }
     else if(User.toLowerCase()=="inspection head")
     {
        console.log("========")
        return Inspection_Head_Nav;
     }
     else if(User.toLowerCase()=="planning and engineering")
     {
        // console.log(">>>>>>>>>>>>>")
        return Planning_Engineering_Nav;
     }
     else{
        console.log("..........+.",User)
            return inspector ;
        
     }
}