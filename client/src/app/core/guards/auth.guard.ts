import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth-service.service";

export const AuthGuard: CanActivateFn = (
  route,
  state,
) => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.getAuthToken()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
