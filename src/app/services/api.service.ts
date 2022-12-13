import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
   url = 'https://data-app.herokuapp.com'


  constructor(private httpClient: HttpClient) { }

  getData(){
    const dataUrl = this.url + '/v1/accounts/all'
    return this.httpClient.get(dataUrl)
  }

  getDataWithParameter(totalNumber: number){
    const dataUrl = this.url + '/v1/accounts/' +totalNumber
    return this.httpClient.get(dataUrl)
  }
}
