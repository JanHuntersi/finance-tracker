import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-saving-goal-details',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './saving-goal-details.component.html',
  styleUrl: './saving-goal-details.component.css'
})
export class SavingGoalDetailsComponent {
  @Input() public goal: any | null = null;
  @Input() public showGoal: boolean = true;
  @Input() public totalSaved: number = 0;
}
