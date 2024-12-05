import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthGuard } from './Guards/auth.guard';
import { AuthComponent } from './Pages/auth/auth.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { OrderComponent } from './Pages/order/order.component';
import { OrderDetailComponent } from './Pages/order-detail/order-detail.component';

export const routes: Routes = [
  {
    path:'',
    component:MainLayoutComponent,
    canActivateChild:[AuthGuard],
    children:[
      {
        path:'',redirectTo:'home',pathMatch:'full',
      },

      {
        path:'home', component:DashboardComponent
      },
      {
        path:'order', component:OrderComponent
      },
      {
        path:'order-detail/:id', component:OrderDetailComponent
      },
    ]
  },
  {
    path:'auth',
    component:AuthComponent
  }
];
