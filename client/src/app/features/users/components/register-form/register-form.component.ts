import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "../../../../core/validators/custom-validators";
import {JsonPipe, NgClass, NgIf} from "@angular/common";
import {AuthService} from "../../../../core/services/auth-service.service";
import {Router} from "@angular/router";
import {SubmitButtonComponent} from "../../../../shared/components/submit-button/submit-button.component";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    NgClass,
    SubmitButtonComponent
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit {
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
      const email = this.form.get("email")!.value;
      const password = this.form.get("password")!.value;
      const passwordConfirmation = this.form.get("passwordConfirmation")!.value;

      this.authService.register(username, email, password, passwordConfirmation).subscribe({
        next: (response: any) => {
          console.log("User registered.");

          // Redirect to /login
          this.router.navigate(['/login']).then(r => {});
        },
        error: (response: any) => {
          console.log("Registration failed.");
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
      email:                new FormControl(undefined, [
        Validators.required,
        Validators.email,
      ]),
      password:             new FormControl(undefined, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
      passwordConfirmation: new FormControl(undefined, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
    }, { validators: CustomValidators.matchingPasswordsValidator() });
  }
}
