
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { colorStatusInterface } from '../../interfaces/colorStatusModel';

//rxjs
import { map } from 'rxjs/operators';
import * as $ from "jquery";

//declare let $: any;

export interface myDataTable {
  name: string;
  orderNumber: any;
  status: string;
  inHand: any;
  prodCode: string;
  color: any;
}

// export interface colorStatus {
//   color: string
// }

// export interface DataTable {
//   attachments: any,
//   date: any,
//   from: any,
//   headerLines: any,
//   headers: any,
//   html: any,
//   messageId: any,
//   subject: any,
//   text: any,
//   textAsHtml: any,
//   to: any
// }

export interface DataTable {
  name: string;
  orderNumber: any;
  inHand: any;
  productCode: string;
}




@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderTableComponent implements OnInit {


  emails1: any; // old version
  userData: Array<any> = []; // user data arr
  newArr: Array<any> = []; // main arr ngFor
  panelOpenState = false; // collapsed 

  ELEMENT_DATA: myDataTable[] = [ // you have to set value from data base in ngOnInit !!!!!!!!!!!!!!!!!!!
    // { orderNumber: '', name: '', status: 'Dne', inHand: '', prodCode: '' },
    // { orderNumber: 'Order number 20000 received', name: 'Popup Display', status: 'Done', inHand: '01/07', prodCode: 'or101' },
    // { orderNumber: 'Order number 20000 received', name: 'SEG Display', status: 'Done', inHand: '05/07', prodCode: 'or104' },
    // { orderNumber: 'Order number 20000 received', name: 'Slim Tension', status: 'Done', inHand: '03/02', prodCode: 'or1012' },
    { orderNumber: 'Order number 20000 received', name: 'Tower', status: 'Done', inHand: '07/07', prodCode: 'or122', color: [] },
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue, this.dataSource.filter, filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator; // get paginator
  @ViewChild(MatSort) sort!: MatSort;


  //* section color for selected value *
  myIndex = 0 // index for tr ngFor
  optionCurrentIndex: any; // index from option select menu

  //statusArray = ['newOrder', 'approvedOrder', 'holdOnOrder', 'noMoneyOrder', 'done']
  statusArray = [ {status: 'newOrder', color: 'green'}, { status: 'approvedOrder', color: 'red' }, { status: 'holdOnOrder', color: 'yellow' }, { status: 'noMoneyOrder', color: 'blue' }, { status: 'done', color: 'black' }]


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  constructor(fb: FormBuilder, private _api: ApiService, private element: ElementRef) {
  }

  // MatPaginator Output
  pageEvent!: PageEvent;
  //datasource: null;
  pageIndex!: number;
  pageSize!: number;
  length!: number;
  pageSizeOptions: number[] = [4, 8, 10]//[5, 10, 25, 100];
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  colorStatusResult: any;
  async ngOnInit() {
    this.colorStatusResult = await this._api.getColor();
    console.log(this.colorStatusResult)
    
    this.getEmails().pipe((map) => {
      return map
    }).subscribe((res: any) => {
      //console.log(res.result)
      let emails2 = res.result;
      this.length = emails2.length;
      console.log(emails2.length)

      emails2.forEach((item: any, index: number) => {
        this.newArr.push(item.allInfo[0]);
        this.ELEMENT_DATA.push(item.allInfo[0]);
        this.dataSource.paginator = this.paginator; // initialize firs load paginator to avoid empty space in mat table
      });
      this.newArr.map((item: any, index: number) => {
        const userData = item.text.split('*');

        this.newArr[index].userEmailInfo = {
          billTo: userData[2].split('\n ').join(', ').replace(/\n/g, " "),
          shipTo: userData[4].split('\n ').join(', ').replace(/\n/g, " "),
          paymentInfo: {
            creditCard: userData[8].split('\n').join(',').replace(' ', '').slice(1, userData[8].length - 2),
            expire: userData[20].split('\n').join(',').replace(',', ' ').slice(1, userData[20].length - 2)
          },
          shippingMethod: userData[22].split('\n ').join(', ').replace(/\n/g, ""),
        }

        const orderData = userData[34].split('\n');
        //console.log(orderData)
        this.ELEMENT_DATA[index].orderNumber = item.subject // HERE I HAVE TO PUT ORDER NUMBER MATERIALS
        this.ELEMENT_DATA[index].prodCode = orderData[2] // HERE I HAVE TO PUT PRODUCT CODE MATERIALS
        this.ELEMENT_DATA[index].name = orderData[4] // HERE I HAVE TO PUT PRODUCT NAME MATERIALS
        //console.log(this.ELEMENT_DATA)
        this.newArr[index].orderDetail = {
          productCode: orderData[2],
          productName: orderData[4],
          options: orderData[5],
          quantity: orderData[7],
          price: orderData[9],
          subTotal: orderData[19],
          salesTax: orderData[25],
          shippingCost: orderData[31],
          grandTotal: orderData[37],
          deadline: orderData[41],
        }

      });

      // this.emails2.map((item: any, index: number) => {
      //   console.log(item, 'this emails item')
      //   const userData = item.text.split('*');
      //   this.emails2[index].userEmailInfo = {
      //     billTo: userData[2].split('\n ').join(', ').replace(/\n/g, " "),
      //     shipTo: userData[4].split('\n ').join(', ').replace(/\n/g, " "),
      //     paymentInfo: {
      //       creditCard: userData[8].split('\n').join(',').replace(' ', '').slice(1, userData[8].length - 2),
      //       expire: userData[20].split('\n').join(',').replace(',', ' ').slice(1, userData[20].length - 2)
      //     },
      //     shippingMethod: userData[22].split('\n ').join(', ').replace(/\n/g, ""),
      //   }
      //   // data from email order info
      //   const orderData = userData[34].split('\n');
      //   //console.log(orderData)
      //   this.emails2[index].orderDetail = {
      //     productCode: orderData[2],
      //     productName: orderData[4],
      //     options: orderData[5],
      //     quantity: orderData[7],
      //     price: orderData[9],
      //     subTotal: orderData[19],
      //     salesTax: orderData[25],
      //     shippingCost: orderData[31],
      //     grandTotal: orderData[37],
      //     deadline: orderData[41]
      //   }
      // });
    },
      error => console.log(error))


    // old version. Fetch items from email
    this.dataEmails().pipe(
      map => map
    ).subscribe((response: any) => {
      //console.log(response.data[0].text.split('*'))
      this.emails1 = response.data;
      console.log(this.emails1, 'this emails 1')
      this.emails1.map((item: any, index: number) => {
        const userData = item.text.split('*');
        this.userData.push(userData) // this obj must be send via api service

        this.emails1[index].userEmailInfo = {
          billTo: userData[2].split('\n ').join(', ').replace(/\n/g, " "),
          shipTo: userData[4].split('\n ').join(', ').replace(/\n/g, " "),
          paymentInfo: {
            creditCard: userData[8].split('\n').join(',').replace(' ', '').slice(1, userData[8].length - 2),
            expire: userData[20].split('\n').join(',').replace(',', ' ').slice(1, userData[20].length - 2)
          },
          shippingMethod: userData[22].split('\n ').join(', ').replace(/\n/g, ""),
        }

        // data from email order info
        const orderData = userData[34].split('\n');
        this.emails1[index].orderDetail = {
          productCode: orderData[2],
          productName: orderData[4],
          options: orderData[5],
          quantity: orderData[7],
          price: orderData[9],
          subTotal: orderData[19],
          salesTax: orderData[25],
          shippingCost: orderData[31],
          grandTotal: orderData[37],
          deadline: orderData[41]
        }
        //this.userData.push(orderData)
        console.log(this.emails1)
      });
    },
      error => console.log(error))
  }
  // get emails order
  dataEmails() {
    return this._api.receiveAllEmails()
  }

  // get all emails from data base
  getEmails() {
    return this._api.allEmails();
  }

  // save all emails
  sendEmails() {
    //return this._api.saveEmails(this.userData)
    return this._api.saveEmails(this.emails1)
  }



  getMainData(val: any) {
    return val
  }



  ///
  // whenClicked = [ 
  //                 { status: 'newOrder', value: false, position: 1 } , 
  //                 { status: 'approvedOrder', value: false, position: 2 }, 
  //                 { status: 'holdOnOrder', value: false, position: 3 }, 
  //                 { status: 'noMoneyOrder', value: false, position: 4 }, 
  //                 { status: 'done', value: false, position: 5 } 
  //               ]; 


  onChange(selectedValue: any, index: any, event: any) {
    this.optionCurrentIndex = event.currentTarget.options.selectedIndex; // get current index from selected value
    console.log(this.optionCurrentIndex)
    this.myIndex = index;
    this.colors(this.optionCurrentIndex)
  }

  colors(index: number): any {
    switch (index) {
      case 0: return 'green'
      case 1: return 'blue'
      case 2: return 'yellow'
      case 3: return 'pink'
      case 4: return '#07fd07'
      default: return 'transparent'
    }
  }

  myTextDecoration = 'line-through';

  // getColor(index :number) : string {
  //   switch( this.orderStatus) { 
  //     case 'done' : return 'green' 
  //     case 'newOrder' : return "blue"
  //     case 'approvedOrder' : return "yellow"
  //     case 'holdOnOrder': return "grey"
  //     default: return "transparent"
  //   }
  // }



  orderData = [
    {
      name: 'Payment Processed',
      value1: '9/3',
      value2: 'Taras',
      value3: 'example ...'
    },
    {
      name: 'Order Checked',
      value1: '9/3',
      value2: 'Jack',
      value3: 'example ...'
    },
    {
      name: 'Vendor Proof Sent to Client',
      value1: '9/3',
      value2: 'Smith',
      value3: 'example ...',
    },
    {
      name: 'Graphic Sent To Vendor',
      value1: '9/3',
      value2: 'Taras',
      value3: 'example ...',
    },
    {
      name: 'Client Approval Sent To Vendor',
      value1: '9/3',
      value2: '...',
      value3: '9/3',
    }
  ]


  // order data table edit bar
  enableEdit = false;
  enableEditIndex = null;
  editInput = '';
  cancelVal = '';

  editValue(e: any, index: any, value: any) {
    e.preventDefault();
    this.enableEdit = true;
    this.enableEditIndex = index;
    this.cancelVal = value;
    console.log(index, e, value)
  }
  saveValue(event: any, value: any) {
    //console.log("Parents parent sibling:", event.target.parentElement.children[0]); // get parent child value
    event.target.parentElement.children[0].innerText = value;
    this.editInput = '';
    //console.log(value)
    this.enableEdit = false;

  }
  cancel() {
    this.editInput = this.cancelVal;
    this.enableEdit = false;
  }



  colorStatus: colorStatusInterface[] = []; //  color status

  displayedColumns: string[] = ['orderNo', 'name', 'status', 'inHand', 'prodCode'];
  onChange1(selectedValue: any, index: any, event: any) {
    this.optionCurrentIndex = event.currentTarget.options.selectedIndex; // get current index from selected value
    console.log(this.optionCurrentIndex)
    this.myIndex = index;
    this.colors(this.optionCurrentIndex)

    const color: any = this.statusArray[this.optionCurrentIndex].color; // initialize color
    if(this.colorStatus.length === 0) this.colorStatus.push(color) // add color if arr is empty
    else if ( this.colorStatus.length > 0 && !this.colorStatus.includes(color) ) this.colorStatus.push(color) // add all colors if arr does not includes duplicated values
    else if( this.colorStatus.includes(color) ) this.colorStatus.splice(this.colorStatus.indexOf(color), 1) // remove colors from array if choose 2 times
    this.ELEMENT_DATA[index].color = this.colorStatus;
    console.log(this.colorStatus, this.ELEMENT_DATA[index].color.length)
  }

  orderColorDataArr: any = [];
  async sendColorStatus(i: any) { // send colors to the mongoDB
    console.log(i,this.ELEMENT_DATA[i].orderNumber)
    const orderNumber = this.ELEMENT_DATA[i].orderNumber.replace(/[^0-9]/g,'');
    const orderColorObj: any = { 
      orderNumber,
      colorStatusArr: this.colorStatus
    };
    this.orderColorDataArr.push(orderColorObj);
    console.log(this.orderColorDataArr)
    //const pickedColorStatus: any = await this._api.colorStatus(this.orderColorDataArr);
    //console.log(pickedColorStatus)
    this.colorStatus = [];
    // console.log(this.colorStatus, this.ELEMENT_DATA[i])
  }

  async getColorStatus() {
    const colorStatusResult = await this._api.getColor();
    console.log(typeof colorStatusResult)
    //return colorStatusResult
  }

}
