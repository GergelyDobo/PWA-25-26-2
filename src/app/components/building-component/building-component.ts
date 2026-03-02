import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatAnchor } from "@angular/material/button";
import { MoneyFormatPipePipe } from "../../pipes/money-format-pipe-pipe";
import { ManagementService } from '../../services/management-service';

export interface Building {
  id: number;
  name: string;
  price: number;
  amountPurchased: number;
  imageUrl: string;
  description: string;
  income: number;
}

@Component({
  selector: 'app-building-component',
  imports: [MatCardModule, MatAnchor, MoneyFormatPipePipe],
  templateUrl: './building-component.html',
  styleUrl: './building-component.scss',
})
export class BuildingComponent {
  @Input() building!: Building;

  protected readonly mgmtService: ManagementService = inject(ManagementService);
}
