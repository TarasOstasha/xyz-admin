
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';


export interface PeriodicElement {
  name: string;
  orderNumber: number;
  inHand: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {orderNumber: 1, name: 'Hydrogen', inHand: 1.0079, symbol: 'H'},
  {orderNumber: 2, name: 'Helium', inHand: 4.0026, symbol: 'He'},
  {orderNumber: 3, name: 'Lithium', inHand: 6.941, symbol: 'Li'},
  {orderNumber: 4, name: 'Beryllium', inHand: 9.0122, symbol: 'Be'},
  {orderNumber: 5, name: 'Boron', inHand: 10.811, symbol: 'B'},
  {orderNumber: 6, name: 'Carbon', inHand: 12.0107, symbol: 'C'},
  {orderNumber: 7, name: 'Nitrogen', inHand: 14.0067, symbol: 'N'},
  {orderNumber: 8, name: 'Oxygen', inHand: 15.9994, symbol: 'O'},
  {orderNumber: 9, name: 'Fluorine', inHand: 18.9984, symbol: 'F'},
  {orderNumber: 10, name: 'Neon', inHand: 20.1797, symbol: 'Ne'},
  {orderNumber: 11, name: 'Hydrogen', inHand: 1.0079, symbol: 'H'},
  {orderNumber: 12, name: 'Helium', inHand: 4.0026, symbol: 'He'},
  {orderNumber: 13, name: 'Lithium', inHand: 6.941, symbol: 'Li'},
  {orderNumber: 14, name: 'Beryllium', inHand: 9.0122, symbol: 'Be'},
  {orderNumber: 15, name: 'Boron', inHand: 10.811, symbol: 'B'},
  {orderNumber: 16, name: 'Carbon', inHand: 12.0107, symbol: 'C'},
  {orderNumber: 17, name: 'Nitrogen', inHand: 14.0067, symbol: 'N'},
  {orderNumber: 18, name: 'Oxygen', inHand: 15.9994, symbol: 'O'},
  {orderNumber: 19, name: 'Fluorine', inHand: 18.9984, symbol: 'F'},
  {orderNumber: 20, name: 'Neon', inHand: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator; // get paginator
  @ViewChild(MatSort) sort!: MatSort;


  expandedElement: boolean = false; //PeriodicElement | null;


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

  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = ['select', 'orderNumber', 'name', 'inHand', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    console.log(this.selection)
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orderNumber + 1}` ;
  }


 }
