import { Component, inject } from '@angular/core';
import { MoneyFormatPipePipe } from './pipes/money-format-pipe-pipe';
import { MoneyButtonComponent } from './components/money-button-component/money-button-component';
import { HighlightDirective } from './directives/highlight-directive';
import { ManagementService } from './services/management-service';
import { BuildingComponent } from './components/building-component/building-component';

@Component({
  selector: 'app-root',
  imports: [MoneyFormatPipePipe, MoneyButtonComponent, HighlightDirective, BuildingComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly managementService : ManagementService = inject(ManagementService);
}
