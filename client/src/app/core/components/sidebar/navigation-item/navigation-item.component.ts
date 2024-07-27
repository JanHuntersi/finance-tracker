import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-navigation-item',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf
  ],
  templateUrl: './navigation-item.component.html',
  styleUrl: './navigation-item.component.css'
})
export class NavigationItemComponent {
  @Input() public isOpen: boolean = false;
  @Input() public fontIcon: string = "";
  @Input() public title: string = "";
  @Input() public routerLink: string = "/";
}
