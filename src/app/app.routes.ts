import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ControlPanelComponent } from './pages/control-panel/control-panel.component';
import { AuthGuard } from './guards/auth-guard.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'panel',
    component : ControlPanelComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];
