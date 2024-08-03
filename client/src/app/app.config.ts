import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { AuthInterceptor } from './core/interceptors/auth-interceptor.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from "@angular/material/dialog";
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { provideNativeDateAdapter } from "@angular/material/core";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:    true,
    },
    provideAnimationsAsync(),
    MatDialogModule,
    CanvasJSAngularChartsModule,
    provideNativeDateAdapter(),
  ]
};
