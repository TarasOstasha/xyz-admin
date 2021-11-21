import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orders'
})
export class OrdersPipe implements PipeTransform {

  //transform(value: unknown, ...args: unknown[]): unknown {
  transform(value: any, ...args: unknown[]): unknown {
    return value.replace(/[^0-9]/g,''); // cut just numbers from string
  }

}
