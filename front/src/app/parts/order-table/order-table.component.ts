
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

//rxjs
import { map } from 'rxjs/operators';
import * as $ from "jquery";

//declare let $: any;

export interface myDataTable {
  name: string;
  orderNumber: number;
  status: string;
  inHand: any;
  prodCode: string;
}

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
    { orderNumber: 1, name: 'Backlit Display', status: 'Done', inHand: '02/12', prodCode: 'or100' },
    { orderNumber: 2, name: 'Popup Display', status: 'Done', inHand: '01/07', prodCode: 'or101' },
    { orderNumber: 3, name: 'SEG Display', status: 'Done', inHand: '05/07', prodCode: 'or104' },
    { orderNumber: 4, name: 'Slim Tension', status: 'Done', inHand: '03/02', prodCode: 'or1012' },
    { orderNumber: 5, name: 'Tower', status: 'Done', inHand: '07/07', prodCode: 'or122' },
    // { orderNumber: 6, name: 'Digital Kiosk', status: 'Done', inHand: '03/02', prodCode: 'or150' },
    // { orderNumber: 7, name: 'Hanging Sign', status: 'Done', inHand: '04/09', prodCode: 'or180' },
    // { orderNumber: 8, name: 'Banner Stand', status: 'Done', inHand: '01/02', prodCode: 'or190' },
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue, this.dataSource.filter, filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // @ViewChild(MatPaginator) paginator!: MatPaginator; // get paginator
  // @ViewChild(MatSort) sort!: MatSort;


  //* section color for selected value *
  myIndex = 0 // index for tr ngFor
  optionCurrentIndex: any; // index from option select menu

  statusArray = ['newOrder', 'approvedOrder', 'holdOnOrder', 'noMoneyOrder', 'done']

  ngAfterViewInit() {
 
  }


  constructor(fb: FormBuilder, private _api: ApiService, private element: ElementRef) {
  }



  ngOnInit(): void {
    console.log(this.newArr)
    this.getEmails().pipe((map) => {
      return map
    }).subscribe((res: any) => {
      //console.log(res.result)
      let emails2 = res.result;
      console.log(emails2)

      emails2.forEach((item: any, index: number)=>{ 
         this.newArr.push(item.allInfo[0]);
         
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
        console.log(this.ELEMENT_DATA)
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
        //console.log(this.emails1)
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
    return this._api.saveEmails(this.userData)
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




  displayedColumns: string[] = ['orderNo', 'name', 'status', 'inHand', 'prodCode'];
  onChange1(selectedValue: any, index: any, event: any) {
    this.optionCurrentIndex = event.currentTarget.options.selectedIndex; // get current index from selected value
    console.log(this.optionCurrentIndex)
    this.myIndex = index;
    this.colors(this.optionCurrentIndex)
  }

}
