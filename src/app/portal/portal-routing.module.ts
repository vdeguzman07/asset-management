import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalComponent } from './portal.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'assets',
      },
      {
        path: 'assets',
        loadChildren: () =>
          import('./asset-management/asset-management.module').then(
            (m) => m.AssetManagementModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalRoutingModule {}
