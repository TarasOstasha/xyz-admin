import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { colorStatusInterface } from '../interfaces/colorStatusModel';



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
    return !!localStorage.getItem('name')
  }

  private _isLoggedIn = new BehaviorSubject<boolean>(false); // take a look for the status
  get isLoggedIn() {
    return this._isLoggedIn.asObservable();
  }

  logIn() {
    this._isLoggedIn.next(true); // set true if logged in
    //console.log(this.isLoggedIn)
    return localStorage.getItem('name');
  }
  logOut() {
    this._isLoggedIn.next(false); // set false if logged out
    //console.log(this.isLoggedIn)
    localStorage.removeItem('name');
  }

  colorStatus(colorStatus: colorStatusInterface ) {
    return this._http.post(url + 'color-status', colorStatus).toPromise();
  }

  getColor() {
    return this._http.get(url + 'color-status').toPromise();
  }


}
