import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AssetService } from 'src/app/services/asset/asset.service';
import { AddAssetComponent } from './add-asset/add-asset.component';

@Component({
  selector: 'app-asset-management',
  templateUrl: './asset-management.component.html',
  styleUrls: ['./asset-management.component.scss'],
})
export class AssetManagementComponent implements OnInit {
  loading: boolean = false;
  dataSource: any[] = [];
  totalLength: number = 0;

  pagination: any = {
    pageIndex: 1,
    pageSize: 15,
  };

  defaultQuery: any = {
    find: [],
  };

  search = new FormControl('');

  displayedColumns = [
    'fullName',
    'type',
    'brand',
    'dateReported',
    'serialNumber',
    'assetTag',
    'issue',
    'status',
    'dateCompleted',
    'actions',
  ];

  constructor(private asset: AssetService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchAssets({});
  }

  fetchAssets(query: any) {
    query.limit = this.pagination.pageSize;
    query.page = this.pagination.pageIndex;

    this.defaultQuery = query;
    this.dataSource = [];
    this.loading = true;

    this.asset.getAssets(query).subscribe(
      (res: any) => {
        console.log(res);
        this.totalLength = res.total_docs;
        this.dataSource = res.assets;
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  onSearch() {
    let query: any = { find: [] };

    if (this.search.value) {
      // console.log('EYYYY');
      query.find.push(
        {
          field: 'searchVal',
          operator: '=',
          value: this.search.value,
        },
        {
          field: 'searchFields',
          operator: '=',
          value:
            'firstName,lastName,type,brand,serialNumber,assetTag,issue,status,remarks',
        }
      );
    }

    query.limit = this.pagination.pageSize;
    query.page = this.pagination.pageIndex;

    this.defaultQuery = query;
    this.dataSource = [];
    this.loading = true;

    this.asset.getAssets(query).subscribe(
      (res: any) => {
        console.log(res);
        this.totalLength = res.total_docs;
        this.dataSource = res.assets;
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  addAsset() {
    this.dialog
      .open(AddAssetComponent, { disableClose: true, width: '70%' })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) this.fetchAssets({});
      });
  }

  edit(data: any) {
    console.log(data);
    this.dialog.open(AddAssetComponent, {
      disableClose: true,
      width: '70%',
      data: data,
    });
  }

  onPaginationChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    this.pagination = {
      pageIndex: pageIndex + 1,
      pageSize,
    };

    this.defaultQuery.page = pageIndex + 1;
    this.defaultQuery.limit = pageSize;
    // this.fetchOrders(this.defaultQuery);
  }
}
