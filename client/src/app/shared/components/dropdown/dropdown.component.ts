import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { DropdownItem } from "../../../core/models/DropdownItem";
import {NgForOf} from "@angular/common";
import {AbstractControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements OnInit, OnChanges {
  @Input() public form: FormGroup = new FormGroup({});
  @Input() public name: string = "";
  @Input() public title: string = "Title";
  @Input() public items: Array<any> = [];

  // If we need dropdown to filter items, we need to pass which variable it should check,
  // and which value it should be filtered against
  @Input() public filterByVariable: string = "";
  @Input() public filterByValue: string = "";

  public dropdownItems: Array<DropdownItem> = [];

  public ngOnInit() {
    this.updateDropdownItems();
  }

  public updateDropdownItems(): void {
    // Create a filtered array based on the provided filter
    const filteredItems = (this.filterByValue && this.filterByVariable)
      ? this.items.filter((item: any) => item[this.filterByVariable] === this.filterByValue)
      : this.items;

    // Prepare dropdown items
    this.dropdownItems = filteredItems.map((item: any): DropdownItem => ({
      value: item.id,
      viewValue: item.name,
    }));
  }

  /**
   * If user updated filterByValue, update dropdown items
   *
   * @param { SimpleChanges } changes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterByValue']) {
      this.updateDropdownItems();
    }
  }
}
