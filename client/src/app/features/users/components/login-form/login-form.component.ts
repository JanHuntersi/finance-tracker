import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgClass, NgIf} from "@angular/common";
import {AuthService} from "../../../../core/services/auth.service";
import {Router} from "@angular/router";
import {SubmitButtonComponent} from "../../../../shared/components/submit-button/submit-button.component";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    NgClass,
    SubmitButtonComponent
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit {
  public form: FormGroup = new FormGroup({});

  public constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.initForm();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const username = this.form.get("username")!.value;
      const password = this.form.get("password")!.value;

      this.authService.login(username, password).subscribe({
        next: (response: any) => {
          this.authService.save(response.data);

          // Redirect to /login
          this.router.navigate(['/']).then(r => {});
        },
        error: (response: any) => {
          console.log("Login failed.");
        }
      })
    }
  }

  public initForm(): void {
    this.form = new FormGroup({
      username:             new FormControl(undefined, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20)
      ]),
      password:             new FormControl(undefined, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
    });
  }
}
