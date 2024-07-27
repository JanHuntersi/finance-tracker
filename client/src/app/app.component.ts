import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Sidebar} from "./core/components/sidebar/sidebar/sidebar.component";
import {HeaderComponent} from "./core/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
}
