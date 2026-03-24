import { Injectable } from '@angular/core';
import { Currency } from '../components/settings/currency';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  public currencies: Currency[] = [
    {
      name: 'Forint',
      code: 'Ft',
    },
    {
      name: 'Euro',
      code: '€'
    },
    {
      name: 'Dollar',
      code: '$'
    }
  ];

  public selectedCurrencyCode = this.currencies[2].code;
  
}
