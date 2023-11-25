import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatProgressSpinnerModule,
    HighchartsChartModule,
  ],
})
export class DashboardModule {}
