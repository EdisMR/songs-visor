import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifySvc {

  constructor() { }
  confirm(title: string, message: string, okCallback: () => any) {
    alertify.confirm(title, message, function () {
      okCallback();
    }, function () { });
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }

  prompt(title: string, message: string, defvalue: string): Promise<string> {
    let promise: Promise<string> = new Promise((resolve, reject) => {
      alertify.prompt(title, message, defvalue
        , function (evt: Event, value: string) {
          resolve(value)
        }
        , function () {
          reject("")
        });
    })

    return promise
  }

}
