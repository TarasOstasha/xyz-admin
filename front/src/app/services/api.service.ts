import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



if (location.hostname == 'localhost') var url = 'http://localhost/'; //dev
else var url = '/'; //production

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }


  //get emails
  receiveAllEmails() {
    return this._http.get(url + 'order-emails')
  }



}
