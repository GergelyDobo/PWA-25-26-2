import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatList, MatListItem, MatDivider } from '@angular/material/list';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet, RouterLinkWithHref, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatIconModule, RouterOutlet, MatToolbar, MatDrawerContainer, MatDrawer, MatList, MatListItem, RouterLinkWithHref, MatDivider, MatDrawerContent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);

  openSettings(){
    this.router.navigateByUrl('settings')
  }
}
