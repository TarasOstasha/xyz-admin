import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



if (location.hostname == 'localhost') var url = 'http://localhost/'; //dev
else var url = '/'; //production

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }


  //get emails from email api
  receiveAllEmails() {
    return this._http.get(url + 'order-emails')
  }

  // send to the back end updated email object
  saveEmails(emails: any) {
    console.log(emails, 'emails')
    return this._http.post(`${url}all-emails`, emails)
  }
  // get all emails
  allEmails() {
    return this._http.get(url + 'all-emails')
  }

  // ** auth block
  sendLogin(login: any) {
    return this._http.post(url + 'login', login).toPromise();
  }

  sendUserRegistretion(registerData: any) {
    return this._http.post(url + 'register', registerData).toPromise();
  }

  //check if authentificated user
  get isAuthentificated() {
    return !!localStorage.getItem('token')
  }

  logOut() {
    localStorage.removeItem('token');
  }


}
