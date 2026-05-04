import { Component, inject, Input } from '@angular/core';
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from "@angular/material/icon";
import { MoneyFormatPipe } from "../../pipes/money-format-pipe";
import { ManagementService } from '../../services/management-service';

export interface Building {
  id: number;
  name: string;
  price: number;
  amountPurchased: number;
  imageUrl?: string;
  description?: string;
  income: number;
}

@Component({
  selector: 'app-building-component',
  imports: [MatCardModule, MatAnchor, MoneyFormatPipe, MatIconButton, MatIcon],
  templateUrl: './building-component.html',
  styleUrl: './building-component.scss',
})
export class BuildingComponent {
  @Input() building!: Building;

  protected readonly mgmtService: ManagementService = inject(ManagementService);

  decreaseAmount(){
    this.mgmtService.changeAmount(this.building, 'decrease');
  }

  removeBuilding(){
    this.mgmtService.removeBuilding(this.building);
  }
}
