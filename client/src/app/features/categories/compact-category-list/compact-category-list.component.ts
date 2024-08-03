import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TypePipe} from "../../../core/pipes/type-pipe.pipe";

@Component({
  selector: 'app-compact-category-list',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    NgIf,
    TypePipe,
    NgClass
  ],
  templateUrl: './compact-category-list.component.html',
  styleUrl: './compact-category-list.component.css'
})
export class CompactCategoryListComponent {
  @Input() public categories: Array<any> = [];
  @Input() public selectedCategories: Array<any> = new Array<any>();

  @Output() public selectedCategory: EventEmitter<any> = new EventEmitter<any>();

  public onSelect(category: any): void {
    this.selectedCategory.emit(category);
  }

  /**
   * Checks if the current category is already selected, so it knows if it should color the background
   *
   * @param { any } category
   */
  public isCategorySelected(category: any): boolean {
    return this.selectedCategories.findIndex(c => c.id === category.id) !== -1;
  }

  public getClassBasedOnType(type: number): string {
    switch (type) {
      case 1:
        return "bg-red-100";
      case 2:
        return "bg-green-100";
      case 3:
        return "bg-blue-100";
      default:
        return "";
    }
  }
}
