import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {NgClass, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatListItem} from "@angular/material/list";
import {NavigationItemComponent} from "../navigation-item/navigation-item.component";

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    MatIcon,
    NgClass,
    MatListItem,
    NavigationItemComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class Sidebar {
  public isOpen: boolean = true;

  public constructor(
    public authService: AuthService,
  ) {}

  public toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }
}
