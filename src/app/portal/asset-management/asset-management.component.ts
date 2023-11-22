import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AssetService } from 'src/app/services/asset/asset.service';
import { AddAssetComponent } from './add-asset/add-asset.component';
import { AreYouSureComponent } from './are-you-sure/are-you-sure.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { BulkAddComponent } from './bulk-add/bulk-add.component';
import { formatDate } from '@angular/common';

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

  columns: any = [
    { name: 'First Name', col: 'firstName' },
    { name: 'Last Name', col: 'lastName' },
  ];

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

  constructor(
    private asset: AssetService,
    private dialog: MatDialog,
    private http: HttpClient,
    private sb: MatSnackBar
  ) {}

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
        if (res) {
          this.sb.open(`Asset added successfully`, 'Okay', {
            duration: 2500,
          });
          this.fetchAssets({});
        }
      });
  }

  edit(data: any) {
    console.log(data);
    this.dialog
      .open(AddAssetComponent, {
        disableClose: true,
        width: '70%',
        data: data,
      })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.sb.open(`Asset updated successfully`, 'Okay', {
            duration: 2500,
          });
          this.fetchAssets({});
        }
      });
  }

  delete(data: any) {
    this.dialog
      .open(AreYouSureComponent, {
        data: { msg: `delete ${data.assetTag}` },
      })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.http
            .delete(
              `https://reveal-server.netlify.app/.netlify/functions/server/api/v1/asset/${data._id}`
            )
            .subscribe((res: any) => {
              this.sb.open(`Asset deleted successfully`, 'Okay', {
                duration: 2500,
              });
              this.fetchAssets({});
            });
        }
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
    this.fetchAssets(this.defaultQuery);
  }

  downloadFormat() {
    let headers = [
      [
        'First Name',
        'Last Name',
        'Asset Type',
        'Brand/Model',
        'Date Reported',
        'Serial Number',
        'Asset Tag',
        'Issue',
        'Status',
        'Date Completed',
        'Remarks',
      ],
    ];

    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, headers);

    //Starting in the second row to avoid overriding and skipping headers
    // XLSX.utils.sheet_add_json(ws, arr, { origin: 'A2', skipHeader: true });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'assets.xlsx');
  }

  onFileChange(event: any) {
    // console.log(event);
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    console.log(reader);
    const file = event.target.files[0];

    reader.onload = (event) => {
      console.log(event);
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates: true });
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      console.log(jsonData);
      this.transformExcelData(jsonData);
    };
    reader.readAsBinaryString(file);
  }

  downloading = false;

  exportData() {
    this.downloading = true;
    console.log(this.defaultQuery);
    let dataSource: any = [];
    const query = this.defaultQuery;
    query.limit = 1;
    let totalDocuments = 0;
    // const limit = 3;
    this.asset.getAssets(query).subscribe((res: any) => {
      // console.log(res);
      totalDocuments = res.total_docs;
      let index = 0;
      const batchSize = 30;
      const batch = Math.ceil(totalDocuments / batchSize);
      for (let i = 0; i < batch; i++) {
        this.defaultQuery.limit = batchSize;
        this.defaultQuery.page = i + 1;
        this.asset.getAssets(this.defaultQuery).subscribe((res: any) => {
          // console.log(res);
          if (res) {
            dataSource.push(...res.assets);
            index++;
            // console.log(batch, index);
            if (index === batch) {
              this.downloading = false;
              console.log('Done');
              let toExport = dataSource.map((d: any) => {
                // let date =
                //   formatDate(
                //     d?.dateReported,
                //     'MMM-dd-yyyy',
                //     'en-US',
                //     '+0800'
                //   ) || '';
                // let completed =
                //   formatDate(
                //     d?.dateCompleted,
                //     'MMM-dd-yyyy',
                //     'en-US',
                //     '+0800'
                //   ) || '';
                return {
                  'First Name': d.firstName,
                  'Last Name': d.lastName,
                  'Asset Type': d.type,
                  'Brand/Model': d.brand,
                  'Date Reported': d.dateReported,
                  'Serial Number': d.serialNumber,
                  'Asset Tag': d.assetTag,
                  Issue: d.issue,
                  Status: d.status,
                  'Date Completed': d.dateCompleted,
                  Remarks: d.remarks,
                };
              });

              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(toExport);

              XLSX.utils.book_append_sheet(wb, ws, `${name}`);
              XLSX.writeFile(wb, `Assets.xlsx`);
            }
          }
        });
      }
    });
  }

  transformExcelData(data: any) {
    // console.log(data);
    let i: any = [];
    const excelData = data.Sheet1;
    console.log(excelData);
    for (let item of excelData) {
      let key = Object.keys(item);
      let values = Object.values(item);
      let x;
      let firstName,
        lastName,
        type,
        brand,
        dateReported,
        serialNumber,
        assetTag,
        issue,
        status,
        dateCompleted,
        remarks;
      console.log(key, values);
      // for (let el of this.columns) {
      if (key[0] === 'First Name') firstName = values[0];
      if (key[1] === 'Last Name') lastName = values[1];
      if (key[2] === 'Asset Type') type = values[2];
      if (key[3] === 'Brand/Model') brand = values[3];
      if (key[4] === 'Date Reported') dateReported = values[4];
      if (key[5] === 'Serial Number') serialNumber = values[5];
      if (key[6] === 'Asset Tag') assetTag = values[6];
      if (key[7] === 'Issue') issue = values[7];
      if (key[8] === 'Status') status = values[8];
      if (key[9] === 'Date Completed') dateCompleted = values[9];
      if (key[10] === 'Remarks') remarks = values[10];
      i.push({
        firstName: firstName,
        lastName: lastName,
        type: type,
        brand: brand,
        dateReported: dateReported,
        serialNumber: serialNumber,
        assetTag: assetTag,
        issue: issue,
        status: status,
        remarks: remarks,
        dateCompleted: dateCompleted,
      });
    }
    // console.log(i);
  }

  openBulk() {
    this.dialog
      .open(BulkAddComponent, {
        width: '100%',
        panelClass: 'dialog-no-padding',
      })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) this.fetchAssets({});
      });
  }
}
