import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Building } from '../components/building-component/building-component';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  private readonly router = inject(Router);
  private readonly money = signal(0);

  private db!: IDBDatabase;
  private readonly objectStoreName = "buildings";
  private incomePerSec: number = 0;


  /*
    {
      id: 9998,
      name: 'Coal mine',
      price: 10,
      description: 'The best coal mine ever!',
      imageUrl: '/images/coal-mine.jpeg',
      amountPurchased: 0,
      income: 1
    },
    {
      id: 9999,
      name: 'Banana plantation',
      price: 50,
      description: 'The best banana plantation ever!',
      imageUrl: '/images/banana-plant.webp',
      amountPurchased: 0,
      income: 3
    }
  */
  public readonly buildings = signal<Building[]>([]);

  constructor() {
    this.initIndexedDB();


    setInterval(() => {
      this.money.update((oldValue) => oldValue + this.incomePerSec);
    }, 1000);
  }


  private initIndexedDB(): void {
    // Adatbázis létrehozása (ha még nem létezik) és megnyitása
    const request = indexedDB.open('building-db', 1);

    // Error kezelése az adatbázis létrehozásakor/megnyitásakor
    request.onerror = (event: any) => {
      console.log('Database error: ', event.target.error);
    };

    // Ha a verziószám növekedett (vagy most hoztuk létre az adatbázist), itt kell frissíteni az object store sémát
    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;

      // Object store létrehozása
      const objectStore = db.createObjectStore(this.objectStoreName, { keyPath: 'id', autoIncrement: true });

      // Adatbázis index létrehozása a hatékonyabb működés érdekében
      objectStore.createIndex('nameIndex', 'name', { unique: true });
    };

    // Adatbázis sikeres létrehozásának&megnyitásának kezelése
    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.loadBuildings();
    };
  }

  private loadBuildings(): void {
    const buildings: Building[] = [];

    // Object store tranzakció létrehozása és object store lekérése
    const objectStore = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName);

    // Adatbázisban tárolt objektumok bejárása kurzor segítségével
    // Itt lehet opcionálisan további feltételeket definiálni (az SQL "WHERE"-hez hasonlóan)
    objectStore.openCursor().onsuccess = (event: any) => {
      const cursor: IDBCursorWithValue = event.target.result;

      if (cursor) {
        buildings.push(cursor.value);

        cursor.continue(); // Következő elemre lépés
      } else {
        // Amikor már nincs több objektum, kimentjük a tömböt
        this.buildings.set(buildings);
      }
    };
  }

  public getBuildings(): Building[] {
    return this.buildings();
  }

  public getMoney(): number {
    return this.money();
  }

  public addMoney(amount: number) {
    this.money.update((oldValue) => oldValue + amount);
  }

    public reduceMoney(amount: number) {
    this.money.update((oldValue) => oldValue - amount);
  }

  public buyBuilding(building: Building) {
    if (this.money() < building.price) {
      alert('Error: You do not have enough money');
      return;
    }

    this.changeAmount(building, "increase");
  }

  public createBuilding(building: Partial<Building>): void {
    const newBuilding = {
      ...building,
      amountPurchased: 0,
    } as Building;

    // Object store tranzakció létrehozása és object store lekérése
    const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
    const request = objectStore.add(newBuilding); // "add" request létrehozása

    // Sikeres request lekezelése
    request.onsuccess = (event: any) => {
      const newBuildingWithId = {
        ...newBuilding,
        id: event.target.result, // A "result" a létrehozott épület ID-ja lesz
      } as Building;

      const buildings = this.buildings().concat(newBuildingWithId);
      this.buildings.set(buildings);
    };

    // Request error lekezelése
    request.onerror = (event: any) => {
      console.log('Error creating building: ', event.target.error);
    };

    this.router.navigateByUrl('/home');
  }

  public changeAmount(building: Building, mode: 'increase' | 'decrease'): void {
    const amountChange = mode === 'increase' ? 1 : -1
    const editedBuilding = {
      ...building,
      amountPurchased: building.amountPurchased + amountChange,
    } as Building;

    // Object store tranzakció létrehozása és object store lekérése
    const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
    const request = objectStore.put(editedBuilding); // "put" request létrehozása

    // Sikeres request lekezelése
    request.onsuccess = (event: any) => {
      const id = event.target.result; // A "result" a módosított épület ID-ja lesz
      const buildings = this.buildings();
      const buildingIndex = buildings.findIndex(building => building.id === id);

      if (buildingIndex !== -1) {
        buildings[buildingIndex] = editedBuilding;
        this.buildings.set(buildings);

        this.incomePerSec += building.income * amountChange;
        this.money.update((oldValue) => oldValue - building.price * amountChange);
      }
    }

    // Request error lekezelése
    request.onerror = (event: any) => {
      console.log('Error editing building: ', event.target.error);
    };
  }

  public removeBuilding(building: Building): void {
    // Object store tranzakció létrehozása és object store lekérése
    const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
    const request = objectStore.delete(building.id); // "delete" request létrehozása

    // Sikeres request lekezelése
    request.onsuccess = () => {
      const buildings = this.buildings();
      const buildingIndex = buildings.findIndex(b => b.id === building.id);

      if (buildingIndex !== -1) {
        buildings.splice(buildingIndex, 1); // Memóriában tárolt épület törlése
        this.buildings.set([...buildings]);

        this.incomePerSec -= building.income * building.amountPurchased;
        this.money.update((oldValue) => oldValue + building.price * building.amountPurchased);
      }
    };

    // Request error lekezelése
    request.onerror = (event: any) => {
      console.log('Error deleting building: ', event.target.error);
    };
  }
}
