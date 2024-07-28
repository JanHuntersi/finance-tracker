import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CategoryService} from "../../../core/services/category.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TransactionFormComponent} from "../../transactions/transaction-form/transaction-form.component";
import {MatIcon} from "@angular/material/icon";
import {TypePipe} from "../../../core/pipes/type-pipe.pipe";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    TransactionFormComponent,
    MatIcon,
    TypePipe,
    NgClass,
    MatTooltip
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit, OnChanges {
  @Input() public searchString: string = "";
  @Input() public selectedCategories: Array<any> = new Array<any>();
  @Input() public refreshList: boolean = false;

  @Output() public selectedCategory: EventEmitter<any> = new EventEmitter<any>();
  @Output() public editCategory: EventEmitter<any> = new EventEmitter<any>();
  @Output() public categoryEmitter: EventEmitter<any> = new EventEmitter<any>();

  public categories: Array<any> = [];
  public filteredCategories: Array<any> = [];

  public constructor(
    public categoryService: CategoryService,
  ) {}

  public ngOnInit(): void {
    this.getCategories();
  }

  /**
   * Get categories that belong to the user
   */
  public getCategories(): void {
    this.categoryService.getUserCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data.categories;
        this.updateList();
        this.categoryEmitter.emit(this.categories);
      }
    });
  }

  /**
   * Checks if the current category is already selected, so it knows if it should color the background
   *
   * @param { any } category
   */
  public isCategorySelected(category: any): boolean {
    return this.selectedCategories.findIndex(c => c.id === category.id) !== -1;
  }

  /**
   * If user clicks a category, emit the category to page component, so it adds the category to the selected categories
   *
   * @param { any } category
   */
  public onSelect(category: any): void {
    if (!category.default) {
      this.selectedCategory.emit(category);
    }
  }

  /**
   * If user double-clicks a category, emit the category to page component, so it opens the edit form with its details
   *
   * @param { any } category
   */
  public onDoubleClick(category: any): void {
    if (!category.default) {
      this.editCategory.emit(category);
    }
  }

  /**
   * Checking for changes on @Input() properties
   *
   * @param { SimpleChanges } changes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    // User input something into the search string
    if (changes['searchString']) {
      this.updateList();
    }

    // User deleted categories, so we need to refresh the list
    if (changes['refreshList']) {
      this.getCategories();
    }
  }

  /**
   * Update the list with filtered categories based on the search string
   */
  public updateList(): void {
    const searchTerm: string = this.searchString.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm) || category.description.toLowerCase().includes(searchTerm)
    );
  }
}
