import { Routes } from '@angular/router';

import { DashboardPageComponent } from "./features/pages/dashboard/dashboard-page/dashboard-page.component";

import { HomePageComponent } from "./features/pages/home/home-page/home-page.component";
import { RegisterPageComponent } from './features/users/components/register-page/register-page.component';
import { LoginPageComponent } from './features/users/components/login-page/login-page.component';
import { LogoutPageComponent } from './features/users/components/logout-page/logout-page.component';
import { AnalyticsPageComponent } from "./features/pages/analytics/analytics-page/analytics-page.component";
import { TransactionsPageComponent } from "./features/pages/transactioncs/transactions-page/transactions-page.component";
import { SavingsPageComponent } from "./features/pages/savings/savings-page/savings-page.component";
import { BudgetsPageComponent } from "./features/pages/budgets/budgets-page/budgets-page.component";
import { CategoriesPageComponent } from "./features/pages/categories/categories-page/categories-page.component";
import { ReportsPageComponent } from "./features/pages/reports/reports-page/reports-page.component";
import { SettingsPageComponent } from "./features/pages/settings/settings-page/settings-page.component";
import { HelpPageComponent } from "./features/pages/help/help-page/help-page.component";
import {AuthGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: "Home",
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    title: "Dashboard",
    canActivate: [AuthGuard],
  },
  {
    path: 'analytics',
    component: AnalyticsPageComponent,
    title: "Analytics",
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    component: TransactionsPageComponent,
    title: "Transactions",
    canActivate: [AuthGuard],
  },
  {
    path: 'savings',
    component: SavingsPageComponent,
    title: "Savings",
    canActivate: [AuthGuard],
  },
  {
    path: 'budgets',
    component: BudgetsPageComponent,
    title: "Budgets",
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    component: CategoriesPageComponent,
    title: "Categories",
    canActivate: [AuthGuard],
  },
  {
    path: 'reports',
    component: ReportsPageComponent,
    title: "Reports",
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    title: "Settings",
    canActivate: [AuthGuard],
  },
  {
    path: 'help',
    component: HelpPageComponent,
    title: "Help",
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
