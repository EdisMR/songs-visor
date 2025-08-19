import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-debug-component',
  standalone: false,
  templateUrl: './debug-component.html',
  styleUrl: './debug-component.scss'
})
export class DebugComponent {
  DeviceDetails = {
    "platform": navigator.platform,
    "hardwareConcurrency": navigator.hardwareConcurrency,
    "maxTouchPoints": navigator.maxTouchPoints,
  };

  browserDetails = {
    "userAgent": navigator.userAgent,
    "appName": navigator.appName,
    "appVersion": navigator.appVersion,
    "product": navigator.product,
    "productSub": navigator.productSub,
    "vendor": navigator.vendor,
    "doNotTrack": navigator.doNotTrack,
    "cookieEnabled": navigator.cookieEnabled,
    "language": navigator.language,
    "languages": navigator.languages,
  };

  screenDetails = {
    "screenWidth": screen.width,
    "screenHeight": screen.height,
    "availWidth": screen.availWidth,
    "availHeight": screen.availHeight,
    "colorDepth": screen.colorDepth,
    "pixelDepth": screen.pixelDepth,
    "orientationAngle": screen.orientation.angle,
    "orientationType": screen.orientation.type,
    "orientationOnChange": screen.orientation.onchange ? "Yes" : "No",
  };

  public get debugData(): string {
    return JSON.stringify({
      projectDetails: {
        projectShortName: environment.shortNameVersion,
        projectBuildDate: environment.dateBuild,
        currentClientDate: this.parseDate(new Date()),
      },
      DeviceDetails: this.DeviceDetails,
      browserDetails: this.browserDetails,
      screenDetails: this.screenDetails,
    }, null, 4)
  };

  parseDate(date: Date | string) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
