import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

const KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  public setUser(user: User) {
    window.sessionStorage.removeItem(KEY);
    window.sessionStorage.setItem(KEY, JSON.stringify(user));
  }
  public getUser(): User | null {
    const user = window.sessionStorage.getItem(KEY);
    if (user) return JSON.parse(user);
    return null;
  }
  public isLogged(): boolean {
    return this.getUser() ? true : false;
  }
  public logout(){
    window.sessionStorage.clear()
  }
}
