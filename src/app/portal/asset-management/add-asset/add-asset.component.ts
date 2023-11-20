import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssetService } from 'src/app/services/asset/asset.service';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss'],
})
export class AddAssetComponent implements OnInit {
  assetForm = this.fb.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    dateReported: new FormControl('', [Validators.required]),
    serialNumber: new FormControl('', [Validators.required]),
    assetTag: new FormControl('', [Validators.required]),
    issue: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    dateCompleted: new FormControl(''),
  });
  saving: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAssetComponent>,
    private fb: FormBuilder,
    private asset: AssetService
  ) {}

  ngOnInit(): void {
    if (this.data) this.assetForm.patchValue(this.data);
  }

  addAsset() {
    this.saving = true;
    const value = this.assetForm.getRawValue();
    console.log(value);
    this.asset.createAsset(value).subscribe(
      (res: any) => {
        console.log(res);
        this.saving = false;
        this.dialogRef.close(true);
      },
      (err) => {
        console.log(err);
        this.saving = false;
      }
    );
  }
}
