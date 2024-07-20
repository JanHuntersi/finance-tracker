import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavigationComponent} from "./core/components/navigation/navigation.component";
import {HeaderComponent} from "./core/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
}
