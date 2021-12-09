import { Component, OnInit, Output, EventEmitter, ViewChild, AfterContentInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  name: any = '';

  constructor(private _api: ApiService) { }

  ngOnInit(): void {
    this.checkName();
    console.log(this.checkName())
  }

  checkName() {
    return this.name = this._api.logIn();
  }

  logOut() {
    this._api.logOut();
    document.location.href=document.location.href
  }

}
