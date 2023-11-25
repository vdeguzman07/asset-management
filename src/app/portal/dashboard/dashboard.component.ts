import { Component, OnInit } from '@angular/core';
import { AssetService } from 'src/app/services/asset/asset.service';
import * as Highcharts from 'highcharts';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  highCharts = Highcharts;
  date = formatDate(new Date(), 'MMMM/dd/YYYY', 'en-US', '+0800');
  pieOptions: any = {
    chart: {
      type: 'pie',
      // options3d: {
      //   enabled: true,
      //   alpha: 45,
      // },
    },
    title: {
      text: 'AssetsCompletion',
      align: 'left',
    },
    subtitle: {
      text: `Records as of ${this.date}`,
      align: 'left',
    },
    plotOptions: {
      pie: {
        // innerSize: 100,
        // depth: 45,
        dataLabels: {
          enabled: true,
          format:
            '<b style="font-size:9px">{point.name}: ({point.percentage:.1f}% {point.y})</b>',
        },
        colors: ['#3f51b5', '#d33815'],
      },
    },
    series: [
      {
        data: [
          {
            name: 'Completed',
            y: 0,
          },
          {
            name: 'Not Complete',
            y: 0,
          },
        ],
      },
    ],
  };
  options: any = {
    chart: {
      type: 'column',
    },
    title: {
      align: 'left',
      text: `Total Assets count based on category`,
    },
    subtitle: {
      align: 'left',
      text: `Records as of ${this.date}`,
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      title: {
        text: 'Total count',
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%',
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },

    series: [
      {
        name: 'Assets',
        colorByPoint: true,
        data: [],
      },
    ],
  };
  statuses = [
    {
      name: 'Reported to the vendor',
      icon: 'fa-envelope',
      value: 0,
    },
    {
      name: 'ATD',
      icon: 'fa-inbox',
      value: 0,
    },
    {
      name: 'Cancelled',
      icon: 'fa-ban',
      value: 0,
    },
    {
      name: 'Repaired',
      icon: 'fa-screwdriver',
      value: 0,
    },
  ];
  loading: boolean = false;
  loadingpie: boolean = false;
  constructor(private asset: AssetService) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadingpie = true;
    this.asset.dashboard().subscribe((res: any) => {
      console.log(res);
      let tempStatus = res.status;

      for (const s of tempStatus) {
        for (const st of this.statuses) {
          if (s._id === st.name) {
            st.value = s.count;
          }
        }
      }
      console.log(this.statuses);
      res.asset.forEach((data: any) => {
        this.options.series[0].data.push({ name: data._id, y: data.count });
      });
      this.loading = false;
    });

    this.asset.getDashboardCompletion().subscribe((res: any) => {
      console.log(res);
      this.pieOptions.series[0].data[0].y = res.completion[0].completed;
      this.pieOptions.series[0].data[1].y = res.completion[0].notComplete;
      this.loadingpie = false;
    });
  }
}
