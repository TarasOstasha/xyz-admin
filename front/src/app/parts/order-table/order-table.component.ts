
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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

export interface PeriodicElement {
  name: string;
  orderNumber: number;
  inHand: any;
  symbol: string;
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
  orderNumber: number;
  inHand: any;
  productCode: string;
}


// const ELEMENT_DATA: PeriodicElement[] = [
//   { orderNumber: 1, name: 'Backlit Display', inHand: '02/12', symbol: 'or100' },
//   { orderNumber: 2, name: 'Popup Display', inHand: '01/07', symbol: 'or101' },
//   { orderNumber: 3, name: 'SEG Display', inHand: '05/07', symbol: 'or104' },
//   { orderNumber: 4, name: 'Slim Tension', inHand: '03/02', symbol: 'or1012' },
//   { orderNumber: 5, name: 'Tower', inHand: '07/07', symbol: 'or122' },
//   { orderNumber: 6, name: 'Digital Kiosk', inHand: '03/02', symbol: 'or150' },
//   { orderNumber: 7, name: 'Hanging Sign', inHand: '04/09', symbol: 'or180' },
//   { orderNumber: 8, name: 'Banner Stand', inHand: '01/02', symbol: 'or190' },
// ];

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
  emails1: any;
  panelOpenState = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator; // get paginator
  @ViewChild(MatSort) sort!: MatSort;

  emails: DataTable[] = [
    { orderNumber: 1, name: 'Backlit Display', inHand: '02/12', productCode: 'or100' },
    { orderNumber: 2, name: 'Popup Display', inHand: '01/07', productCode: 'or101' },
    { orderNumber: 3, name: 'SEG Display', inHand: '05/07', productCode: 'or104' },
  ]; // emails from server or data base



  statusArray = ['newOrder', 'approvedOrder', 'holdOnOrder', 'noMoneyOrder', 'done']
  newOrder = true;
  approvedOrder = false;
  HoldOnOrder = false;
  NoMoneyOrder = false;
  //checked: any = this.statusArray[0];
  labelPosition: 'newOrder' | 'approvedOrder' = 'approvedOrder';
  orderStatus: any; // set order status;

  ELEMENT_DATA =
    [
      { orderNumber: 1, name: 'Backlit Display', inHand: '02/12', symbol: 'or100' },
      { orderNumber: 2, name: 'Popup Display', inHand: '01/07', symbol: 'or101' },
      { orderNumber: 3, name: 'SEG Display', inHand: '05/07', symbol: 'or104' },
      { orderNumber: 4, name: 'Slim Tension', inHand: '03/02', symbol: 'or1012' },
      { orderNumber: 5, name: 'Tower', inHand: '07/07', symbol: 'or122' },
      { orderNumber: 6, name: 'Digital Kiosk', inHand: '03/02', symbol: 'or150' },
      { orderNumber: 7, name: 'Hanging Sign', inHand: '04/09', symbol: 'or180' },
      { orderNumber: 8, name: 'Banner Stand', inHand: '01/02', symbol: 'or190' },
    ];

  expandedElement: boolean = false; //PeriodicElement | null;

  displayedColumns: string[] = ['select', 'orderNumber', 'name', 'inHand', 'productCode'];
  // dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA); OLD
  // selection = new SelectionModel<PeriodicElement>(true, []); OLD

  dataSource = new MatTableDataSource<DataTable>(this.emails)
  selection = new SelectionModel<DataTable>(true, []);


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(fb: FormBuilder, private _api: ApiService) {
  }



  ngOnInit(): void {


    this.dataEmails().pipe(
      map => map
    ).subscribe((response: any) => {
      //console.log(response.data[0].text.split('*'))
      this.emails1 = response.data;
      this.emails1.map((item: any, index: number) => {
        const userData = item.text.split('*');

        // data from email user info
        this.emails1[index].userEmailInfo = {
          billTo: userData[2].split('\n ').join(', ').replace(/\n/g, " "),
          shipTo: userData[4].split('\n ').join(', ').replace(/\n/g, " "),
          paymentInfo: {
            creditCard: userData[8].split('\n').join(',').replace(' ', '').slice(1, userData[8].length - 2),
            expire: userData[20].split('\n').join(',').replace(',', ' ').slice(1, userData[20].length - 2)
          },
          shippingMethod: userData[22].split('\n ').join(', ').replace(/\n/g, "")
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
        console.log(this.emails1)
      });
    },
      error => console.log(error))

    setTimeout(() => {
      //console.log(this.emails)
    }, 500);


  }
  // get emails order
  dataEmails() {
    return this._api.receiveAllEmails()
  }


  getMainData(val: any) {
    return val
  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. - SELECT ALL CHECKBOX */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    console.log(this.selection)
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: DataTable): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orderNumber + 1}`;
  }



  openHiddenInfo(event: Event) {
    if (this.expandedElement) event.stopPropagation();

  }

  changeStatus(status: any) {
    //console.log(status)
    this.orderStatus = status;
    console.log(status.checked)
  }
  setOrderStatusColor() { // suggesting rewrite code with switch() method 
    let status;
    if (this.orderStatus == 'done') status = 'green'
    else if (this.orderStatus == 'newOrder') status = 'blue'
    else if (this.orderStatus == 'approvedOrder') status = 'yellow'
    else if (this.orderStatus == 'holdOnOrder') status = 'pink'
    else if (this.orderStatus == 'noMoneyOrder') status = 'grey'
    return status
    //console.log(this.orderStatus)
    // switch (this.orderStatus) {
    //   case "green": this.orderStatus == 'done';
    //     break;
    //   case "blue": this.orderStatus == 'newOrder';
    //     break;
    //   case "yellow": this.orderStatus == 'approvedOrder';
    //     break;
    //   case "pink": this.orderStatus == 'holdOnOrder';
    //     break;
    //   case "grey": this.orderStatus == 'noMoneyOrder';
    //     break;
    // }

    // return this.orderStatus == 'done' ? 'green': 'transparent' 
    //       || this.orderStatus == 'newOrder' ? 'blue': 'transparent' 
    //       || this.orderStatus == 'approvedOrder' ? 'yellow': 'transparent' 
    //       || this.orderStatus == 'holdOnOrder' ? 'pink': 'transparent' 
    //       || this.orderStatus == 'noMoneyOrder' ? 'grey': 'transparent' 

  }


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


}
