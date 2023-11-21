import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetManagementRoutingModule } from './asset-management-routing.module';
import { AssetManagementComponent } from './asset-management.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AddAssetComponent } from './add-asset/add-asset.component';
import { AreYouSureComponent } from './are-you-sure/are-you-sure.component';
import { BulkAddComponent } from './bulk-add/bulk-add.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AssetManagementComponent,
    AddAssetComponent,
    AreYouSureComponent,
    BulkAddComponent,
  ],
  imports: [
    CommonModule,
    AssetManagementRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    NgxSkeletonLoaderModule,
    MatTooltipModule,
  ],
})
export class AssetManagementModule {}
