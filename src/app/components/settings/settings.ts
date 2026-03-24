import { Component, inject } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { MatAnchor } from "@angular/material/button";
import { Router } from '@angular/router';
import { Currency } from './currency';
import { SettingsService } from '../../services/settings-service';

@Component({
  selector: 'app-settings',
  imports: [MatFormField, MatLabel, MatSelect, MatAnchor, MatOption],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  public currencies: Currency[];
  public selectedCurrencyCode: string;

  private settingsService = inject(SettingsService);
  private router = inject(Router);

  constructor(){
    this.currencies = this.settingsService.currencies;
    this.selectedCurrencyCode = this.settingsService.selectedCurrencyCode;
  }

  public onCurrencySelect(selection: MatSelectChange) {
    this.settingsService.selectedCurrencyCode = selection.value;
  }

  public backToHome() {
    this.router.navigateByUrl('home')
  }
}
