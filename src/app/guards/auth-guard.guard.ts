import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  return inject(SessionService).isLogged()
    ? true
    : inject(Router).createUrlTree(['/login']);
};
