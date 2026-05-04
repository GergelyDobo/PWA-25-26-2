import { inject, Pipe, PipeTransform } from '@angular/core';
import { SettingsService } from '../services/settings-service';

@Pipe({
  name: 'moneyFormat',
})
export class MoneyFormatPipe implements PipeTransform {
  private settingsService = inject(SettingsService);
  transform(value: number): string {
    return value + ' ' + this.settingsService.selectedCurrencyCode;
  }
}
