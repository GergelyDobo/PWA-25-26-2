import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, shareReplay, switchMap, take } from "rxjs";
import { Box } from "../components/box/box";
import { BoxFireStoreService } from "./box-fire-store-service";
import { ManagementService } from "./management-service";

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private readonly http  = inject(HttpClient);
  private readonly boxFireStoreService  = inject(BoxFireStoreService);
  private readonly managementService  = inject(ManagementService);

  public boxPrice: number = 5;
  private boxes$: Observable<Box[]>;
  public selectedBoxes$: Observable<Box[]>;

  /** HttpClient segít abban, hogy egyszerűen tudjuk lekérdezéseket indítani egy adott API felé, fontos provide-olni a provideHttpClient()-ot hozzá */
  constructor(
  ) {
    // Http lekérés, az tömböt bejárva Box objektumokat készítünk random price-al
    this.boxes$ = this.http.get<Box[]>('https://fakestoreapi.com/products').pipe(
      map((response) =>{
        return response.map(product => ({...product, price: Math.floor(Math.random() * 9)+2} as Box));
      }),
      // Ha nem használjuk a shareReplay-t megnézhetjük a devtools network tab-ján, hogy a request minden click-nél kimegy,
      // Ennek használatával megosztjuk (cacheelve lesz) és visszajátszuk a response értékét, így csak 1x fog a request kimenni
      shareReplay(1) // Meogsztjuk + visszajátszatjuk a korábbi (1) emission értékét, a korai felírazkozás miatt
    );
    this.selectedBoxes$ = this.boxFireStoreService.getAllSelectedBoxes();
  }

  public buyBox(): void {
    // Async módon random egy Box objektumot kiveszünk a tömbből
    this.boxes$.pipe(
      map(boxes => {
        const index = Math.floor(Math.random() * boxes.length);
        return boxes[index];
      }),
      switchMap((box) => this.boxFireStoreService.saveBox(box)),
      take(1)

    ).subscribe();

    this.managementService.reduceMoney(this.boxPrice);
  }

  public sellBox(price:number, id: string): void {
    this.boxFireStoreService.removeBox(id).pipe(take(1)).subscribe();
    this.managementService.addMoney(price);
  }
}
