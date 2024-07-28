import { Component } from '@angular/core';
import {Sidebar} from "../sidebar/sidebar/sidebar.component";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {SearchBarComponent} from "./search-bar/search-bar.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    Sidebar,
    MatIcon,
    NgIf,
    SearchBarComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
