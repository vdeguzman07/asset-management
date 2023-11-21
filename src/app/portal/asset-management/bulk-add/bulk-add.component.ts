import { AssetService } from 'src/app/services/asset/asset.service';
import { Component, Inject, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { retry } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bulk-add',
  templateUrl: './bulk-add.component.html',
  styleUrls: ['./bulk-add.component.scss'],
})
export class BulkAddComponent implements OnInit {
  dataSource: any = [];
  downloading = false;
  constructor(
    private asset: AssetService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BulkAddComponent>,
    private sb: MatSnackBar
  ) {}

  ngOnInit(): void {}

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
      this.dataSource.push({
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
  total: number = 0;
  addBulkData() {
    this.downloading = true;
    this.dataSource.forEach((el: any) => {
      this.asset.createAsset(el).subscribe(
        (res: any) => {
          console.log(res);
          if (res) this.total = this.total + 1;
          if (this.total === this.dataSource.length) {
            this.downloading = false;
            this.dialogRef.close(true);
          }
        },
        (err) => {
          console.log(err);
          this.sb.open(`${err.error.message}`, 'Okay', { duration: 2500 });
          this.total = this.total + 1;

          if (this.total === this.dataSource.length) {
            this.downloading = false;
            this.dialogRef.close(true);
          }
        }
      );
    });
  }
}
