import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyFormatPipe',
})
export class MoneyFormatPipePipe implements PipeTransform {
  transform(value: number): string {
    return '$' + value;
  }
}
