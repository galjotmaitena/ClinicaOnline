import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderAsc'
})
export class OrderAscPipe implements PipeTransform {

  transform(value: any[], ...args: any[]): any[] {
    if(!Array.isArray(value))
    {
      return value;
    }

    const [order = 'asc'] = args;
    return value.sort((a, b)=>{
      const compare = a.apellido.localeCompare(b.apellido);
      return order === 'asc' ? compare : -compare;
    });
  }

}
