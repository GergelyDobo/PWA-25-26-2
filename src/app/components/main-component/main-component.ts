import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HighlightDirective } from '../../directives/highlight-directive';
import { MoneyFormatPipePipe } from '../../pipes/money-format-pipe-pipe';
import { ManagementService } from '../../services/management-service';
import { BuildingComponent } from '../building-component/building-component';
import { MoneyButtonComponent } from "../money-button-component/money-button-component";

@Component({
  selector: 'app-main-component',
  imports: [MoneyFormatPipePipe, MoneyButtonComponent, HighlightDirective, BuildingComponent, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './main-component.html',
  styleUrl: './main-component.scss',
})
export class MainComponent {
  protected readonly managementService: ManagementService = inject(ManagementService);
}
