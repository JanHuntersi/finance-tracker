import { Component } from '@angular/core';
import {Sidebar} from "../sidebar/sidebar/sidebar.component";

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        Sidebar
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
