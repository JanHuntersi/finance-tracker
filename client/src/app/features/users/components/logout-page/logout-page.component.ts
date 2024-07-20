import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../core/services/auth-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout-page',
  standalone: true,
  imports: [],
  templateUrl: './logout-page.component.html',
  styleUrl: './logout-page.component.css'
})
export class LogoutPageComponent implements OnInit {

  public constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  public ngOnInit() {
    this.authService.logout().subscribe({
      next: (response: any) => {
        // Delete the user from local storage
        this.authService.deleteUser();

        // Redirect to /login
        this.router.navigate(['/login']).then(r => {});
      },
      error: (response: any) => {
        console.log(response);
      }
    });
  }
}
