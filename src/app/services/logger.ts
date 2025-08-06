import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { logMessageInterface } from '../interface/logMessage.interface';

@Injectable({
  providedIn: 'root'
})

export class Logger {
  private _log: logMessageInterface[] = [];
  private _logSubject = new BehaviorSubject<logMessageInterface[]>(this._log);
  public get logs$() {
    return this._logSubject.asObservable();
  }

  public log(message: string): void {
    this._log.unshift({
      message: message,
      date: this.parsedDate(),
      uniqueId: window.crypto.randomUUID().slice(0, 8)
    });
    this._logSubject.next(this._log);
  }

  private parsedDate(): string {
    /* Format 2025-12-31,14:12:55 */
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day},${hours}:${minutes}:${seconds}`;
  }

  public clearConsole(): void {
    this._log = [];
    this._logSubject.next(this._log);
  }
}
