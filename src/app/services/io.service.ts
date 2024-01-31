import { io } from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {config} from './../config'
@Injectable({
  providedIn: 'any',
})
export class IoService { 
  private socket = io(config.backendUrl);
  listen(event: string): Observable<any> {
    let observable = new Observable<any>((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
      return () => {
        // this.socket.disconnect();
      };
    });
    return observable;
  }
}
