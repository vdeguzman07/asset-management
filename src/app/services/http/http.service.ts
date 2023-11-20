import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

type Methods = 'get' | 'post' | 'put' | 'delete' | 'patch';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(public http: HttpClient) {}

  getHeaders() {
    const bearer_token = localStorage.getItem('BEARER_TOKEN');
    const headers = new HttpHeaders({
      authorization: `Bearer ${bearer_token}` || '',
    });
    return { headers };
  }

  start<T>(method: Methods, endpoint: string, body?: any, query?: any) {
    let queryArray: Array<string> = [];
    if (query) {
      if (query.filter) {
        queryArray.push(
          `searchVal=${
            query.filter.value
          }&searchFields=${query.filter.fields.join()}`
        );
      }
      if (query.find) {
        query.find.forEach((f: any) => {
          let str = f.field + f.operator + f.value;
          queryArray.push(str);
        });
      }
      if (query.fields) queryArray.push(`fields=${query.fields}`);
      if (query.limit) queryArray.push(`limit=${query.limit}`);
      if (query.page) queryArray.push(`page=${query.page}`);
      if (query.sort) queryArray.push(`sort=${query.sort}`);
      if (query.populates) {
        let temp: Array<string> = [];
        query.populates.forEach((f: any) => {
          var str = `populate=${f.field}`;
          if (f.select) {
            str += `&popField=${f.select}`;
          }
          temp.push(str);
        });
        queryArray.push(temp.join('&'));
      }
    }

    const header = {
      withCredentials: true,
      ...this.getHeaders(),
    };

    // console.log(header);

    let URL = `https://clinquant-liger-ae140b.netlify.app/.netlify/functions/server/api/v1${endpoint}`; //Change here

    // let URL = `http://localhost:3100/.netlify/functions/server/api/v1${endpoint}`;
    let queryStr = queryArray.join('&') ? '?' + queryArray.join('&') : '';

    switch (method) {
      case 'get': // get
        return this.http.get<T>(URL + queryStr, header).pipe();

      case 'post': // insert
        return this.http.post<T>(URL + queryStr, body, header);

      case 'put': // update all
        return this.http.put<T>(URL, body, header);

      case 'patch': // update some
        return this.http.patch<T>(URL, body, header);

      case 'delete': // delete
        return this.http.delete<T>(URL, header);

      default:
        return this.http.get<T>(URL, header);
    }
  }
}
