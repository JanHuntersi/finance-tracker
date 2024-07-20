import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../services/auth-service.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  public constructor(
    public authService: AuthService,
  ) {}
}
