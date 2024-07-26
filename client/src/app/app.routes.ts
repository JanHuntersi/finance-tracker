import { Routes } from '@angular/router';

import { HomePageComponent } from './features/home/home-page/home-page.component';

import { RegisterPageComponent } from './features/users/components/register-page/register-page.component';
import { LoginPageComponent } from './features/users/components/login-page/login-page.component';
import { LogoutPageComponent } from './features/users/components/logout-page/logout-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: "Home page",
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    title: "Register page",
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: "Login page",
  },
  {
    path: 'logout',
    component: LogoutPageComponent,
    title: "Logout page",
  }
];
