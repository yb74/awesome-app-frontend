import { Component } from '@angular/core';
import { TokenTimerService } from './services/token-timer/token-timer.service'; // Adjust the import path as needed

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'awesome-app';

  constructor(public tokenTimerService: TokenTimerService) {}

  toastMessage: string = ''; // Initialize with an empty string
  showToast: boolean = false; // Initialize as false
}