import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  constructor(@Inject(HttpService) private http: HttpService) {}

  getAssets(query: any) {
    return this.http.start('get', '/asset', {}, query);
  }

  createAsset(body: any) {
    return this.http.start('post', '/asset/createAsset', body);
  }

  updateAsset(id: string, body: any) {
    return this.http.start('put', `/asset/${id}`, { body });
  }

  dashboard() {
    return this.http.start('get', `/dashboard/dashboard-data`, {});
  }

  getDashboardCompletion() {
    return this.http.start('get', `/dashboard/dashboard`, {});
  }
}
