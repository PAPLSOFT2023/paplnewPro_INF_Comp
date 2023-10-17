import { INavbarData } from "./helper";

export const SalesNav: INavbarData[] = [
    {
        routeLink: '/userdashboard/sales_home',
        icon: 'fal fa-home',
        label: 'Home'
    },
   
    {
        routeLink: '/userdashboard/sales_v/:selectedOption',
        icon: 'far fa-file-alt',
        label: 'INF-26'

        
    },
   
    
];
export const Inspection_Head_Nav: INavbarData[] = [
    {
        routeLink: '/userdashboard/inspection_home',
        icon: 'fal fa-home',
        label: 'Home'
    },
   
    {
        routeLink: '/userdashboard/inspection_inf/:c_no',
        icon: 'far fa-file-alt',
        label: 'INF-26'

        
    },
   
    
];
export const Planning_Engineering_Nav: INavbarData[] = [
    {
        routeLink: '/userdashboard/plan_eg_home',
        icon: 'fal fa-home',
        label: 'Home'
    },
   
    {
        routeLink: '/userdashboard/plan_eng_inf/:c_no',
        icon: 'far fa-file-alt',
        label: 'INF-26'

        
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
                routeLink: '/afterlogin/app-organization-user-management',
                icon: 'fal fa-user',
                label: 'Profile Details',
            },
        ]
    },
];


export function getNavbarData(User: String): INavbarData[] {


    if(User=="Softwareadmin"){
        return  navbarDataAdmin;
    }
    else if(User=="Organization Admin")
     {
     return oragizationadmin;
     }
     else if(User.toLowerCase()=="sales")
     {
        return SalesNav;
     }
     else if(User.toLowerCase()=="inspection")
     {
        return Inspection_Head_Nav;
     }
     else if(User.toLowerCase()=="planning and engineering")
     {
        return Planning_Engineering_Nav;
     }
     else{
    
            return SalesNav;

        
     }
}