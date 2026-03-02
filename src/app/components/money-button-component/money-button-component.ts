import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ManagementService } from '../../services/management-service';

@Component({
  selector: 'app-money-button-component',
  imports: [MatButtonModule],
  templateUrl: './money-button-component.html',
  styleUrl: './money-button-component.scss',
})
export class MoneyButtonComponent {
  @Input() money!: number;

  private readonly mgmtService = inject(ManagementService);

  onClick(event: Event) {
    event.preventDefault();
    this.mgmtService.addMoney(1);
  }
}
