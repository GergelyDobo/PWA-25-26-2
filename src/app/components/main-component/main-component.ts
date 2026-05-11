import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { HighlightDirective } from '../../directives/highlight-directive';
import { MoneyFormatPipe } from '../../pipes/money-format-pipe';
import { BoxService } from '../../services/box-service';
import { ManagementService } from '../../services/management-service';
import { BoxComponent } from '../box/box.component';
import { BuildingComponent } from '../building-component/building-component';
import { MoneyButtonComponent } from '../money-button-component/money-button-component';

@Component({
  selector: 'app-main-component',
  imports: [
    MoneyFormatPipe,
    MoneyButtonComponent,
    HighlightDirective,
    BuildingComponent,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    BoxComponent,
    AsyncPipe
  ],
  templateUrl: './main-component.html',
  styleUrl: './main-component.scss',
})
export class MainComponent {
  protected readonly boxService = inject(BoxService);
  protected readonly managementService = inject(ManagementService);
  protected readonly swUpdate = inject(SwUpdate);
  protected readonly swPush = inject(SwPush);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly router = inject(Router);

  protected box$ = this.boxService.box$;
  protected boxPrice = this.boxService.boxPrice;

  constructor() {
    /**
     * Ha a notificationre a felsználó kattint akkor push messageből kivesszük az urlt és oda navigálunk (replative path)
     * takeUntilDestroyed() a komponens megsszűnésénel leíratkozik (csak constructorban használható így, máshol: takeUntilDestroyed(this.destroyRef) )
     *
     * Teszteléshez: F12 -> Application -> Service workers -> Push input fieldbe másold ezt be:
    * {   "notification": {     "title": "Go to settings",     "body": "You can change the settings here",     "data": {       "url": "/settings"     }   } }
     */
    this.swPush.notificationClicks.pipe(takeUntilDestroyed()).subscribe((event) => {
      const url = event.notification.data.url;
      if(url){
        this.router.navigateByUrl(url)
      }
    })



    /* Callback-ek, melyeket a listener meghív, ha az adott esemény bekövekezik */
    const offlineListener = () => console.log("offline");
    const onlineListener = () => console.log("online");

    window.addEventListener("offline",offlineListener );
    window.addEventListener("online",onlineListener );


    /*
     * 3000 ms-enként megnézzzük, hogy van-e új verzió a service workerből
     * ha van, akkor jelezzük a felhasználónak, majd újra töltjük az oldalt
     * takeUntilDestroyed() a komponens megsszűnésénel leíratkozik (csak constructorban használható így, máshol: takeUntilDestroyed(this.destroyRef) )
     */
    interval(3000).pipe(takeUntilDestroyed()).subscribe(() => {
      this.swUpdate.checkForUpdate().then((update) => {
        if (update) {
          alert('Töltsd újra az oldalt!');
          window.location.reload();
        }
      });
    });

    /*
     * Töröljük a listenereket, hogy a callback ne hívódjon meg ha újabb esemény érkezne. Ez fontos, hogy ne legyen memory leak.
     * Mivel egy adott eseményre több callbacket is rendelhetünk, ezért azokat is meg kell adni.
     */
    this.destroyRef.onDestroy(() =>{
      window.removeEventListener("offline", offlineListener);
      window.removeEventListener("online", onlineListener);
    })


  }

  protected buyBox():void{
    this.boxService.buyBox();
  }

  protected sellBox(price: number):void{
    this.boxService.sellBox(price);
  }
}
