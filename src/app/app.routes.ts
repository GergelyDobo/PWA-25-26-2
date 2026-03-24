import { Routes } from '@angular/router';
import { canCreateGuard } from './guards/can-create-guard-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./components/main-component/main-component').then(c => c.MainComponent),
  },
  {
    path: 'creation',
    loadComponent: () => import('./components/create-building-page/create-building-page').then(c => c.CreateBuildingPage),
    canActivate: [canCreateGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings').then(c => c.Settings),
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
