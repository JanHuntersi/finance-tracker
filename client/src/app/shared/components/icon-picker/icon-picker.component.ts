import {Component, Input, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {AbstractControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TypePipe} from "../../../core/pipes/type-pipe.pipe";
import {icons} from "../../../core/config/icons";

@Component({
  selector: 'app-icon-picker',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    TypePipe,
    NgIf,
  ],
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.css'
})
export class IconPickerComponent implements OnInit {
  @Input() public form: FormGroup = new FormGroup({});

  public icons: any = icons;
  public selectedCategory = this.icons[0];
  public selectedIcon: string | null = "";

  public ngOnInit() {
    this.selectedIcon = this.form.get('icon')?.value;
  }

  public selectCategory(category: any) {
    this.selectedCategory = category;
  }

  /**
   * Returns icons for the selected category
   *
   * @param { any } category
   */
  public getIconsForCategory(category: any) {
    return category ? category.icons : [];
  }

  /**
   * Set the value of the control
   *
   * @param { string } icon
   */
  public onIconSelect(icon: string): void {
    this.selectedIcon = icon;

    const control: AbstractControl<any, any> | null = this.form.get('icon');

    if (control !== null) {
      control.setValue(this.selectedIcon);
    }
  }
}
