import {Component, EventEmitter, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'search-bar',
  standalone: true,
  imports: [
    MatIcon,
    FormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  public searchString: string = "";

  public onClear(): void {
    this.searchString = "";
  }

  public onSearch(): void {
    this.search.emit(this.searchString);
  }
}
