import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  constructor(private session: SessionService) {}
  currentUser: User | null = {
    id: '',
    email: '',
    username: '',
  };
  ngOnInit(): void {
    if (this.session.isLogged()) {
      this.currentUser = this.session.getUser();
    }
  }
  logout(): void {
    this.session.logout();
    window.location.reload();
  }
}
