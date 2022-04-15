import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { 
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule) 
  },
  { 
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) 
  },
  { 
    path: 'user',
    loadChildren: () => import('./pages/user-tickets/user-tickets.module').then( m => m.UserTicketsPageModule)
  },
  { path: 
    'menu/admin',
    loadChildren: () => import('./pages/admin-dashboard/admin-dashboard.module').then( m => m.AdminDashboardPageModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'menu/all',
    loadChildren: () => import('./pages/all-subscribers/all-subscribers.module').then( m => m.AllSubscribersPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'ticket',
    loadChildren: () => import('./pages/ticket/ticket.module').then( m => m.TicketPageModule)
  },
  { 
    path: 'subscrib',
    loadChildren: () => import('./pages/subscribtion/subscribtion.module').then( m => m.SubscribtionPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'room',
    loadChildren: () => import('./pages/room/room.module').then( m => m.RoomPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'menu/rooms',
    loadChildren: () => import('./pages/admin-rooms/admin-rooms.module').then( m => m.AdminRoomsPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'menu/statistics',
    loadChildren: () => import('./pages/admin-statistics/admin-statistics.module').then( m => m.AdminStatisticsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'menu/meriland',
    loadChildren: () => import('./pages/meriland/meriland.module').then( m => m.MerilandPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'menu/shoubra',
    loadChildren: () => import('./pages/shoubra/shoubra.module').then( m => m.ShoubraPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'subscribtion',
    loadChildren: () => import('./pages/subscribtion/subscribtion.module').then( m => m.SubscribtionPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'meriland',
    loadChildren: () => import('./pages/meriland/meriland.module').then( m => m.MerilandPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'shoubra',
    loadChildren: () => import('./pages/shoubra/shoubra.module').then( m => m.ShoubraPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'all-subscribers',
    loadChildren: () => import('./pages/all-subscribers/all-subscribers.module').then( m => m.AllSubscribersPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: '',
    redirectTo: '/ticket',
    pathMatch: 'full'
  },
  { 
    path: '**',
    redirectTo: '/ticket',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
