import { Injectable, signal } from '@angular/core';
import { Building } from '../components/building-component/building-component';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {

  private money = signal(0);
  private incomePerSec: number = 0;

  private readonly buildings: Building[] = [
    {
      id: 0,
      name: 'Coal mine',
      price: 10,
      description: 'The best coal mine ever!',
      imageUrl: '/images/coal-mine.jpeg',
      amountPurchased: 0,
      income: 1
    },
    {
      id: 1,
      name: 'Banana plantation',
      price: 50,
      description: 'The best banana plantation ever!',
      imageUrl: '/images/banana-plant.webp',
      amountPurchased: 0,
      income: 3
    }
  ];

  constructor() {
    setInterval(() => {
      this.money.update((oldValue) => oldValue + this.incomePerSec);
    }, 1000);
  }

  public getBuildings(): Building[] {
    return this.buildings;
  }

  public getMoney(): number {
    return this.money();
  }

  public addMoney(amount: number) {
    this.money.update((oldValue) => oldValue + amount);
  }

  public buyBuilding(buildingId: number) {
    const building = this.buildings[buildingId];
    if(!Boolean(building)) {
      alert('Building does not exist!');
      return;
    }
    if(this.money() < building.price) {
      alert('Error: You do not have enough money');
      return;
    }
    this.buildings[buildingId].amountPurchased += 1;
    this.incomePerSec += building.income;
    this.money.update((oldValue) => oldValue - building.price);
  }
}
