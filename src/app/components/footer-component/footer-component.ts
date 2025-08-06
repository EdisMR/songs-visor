import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-footer-component',
  standalone: false,
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss'
})
export class FooterComponent {
  public get version(): string {
    let year = new Date().getFullYear();
    return `2025 (${environment.shortNameVersion})`;
  }
}
