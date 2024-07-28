import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type',
  standalone: true
})
export class TypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch(value) {
      case 1:
        return "Expense";

      case 2:
        return "Income";

      case 3:
        return "Savings";

      default:
          return "Select a type";
    }
  }

}
