import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TokenTimerService } from 'src/app/services/token-timer/token-timer.service';

@Component({
  selector: 'app-token-timer',
  templateUrl: './token-timer.component.html',
  styleUrls: ['./token-timer.component.css']
})
export class TokenTimerComponent {
  @Input() message: string = '';
  @Input() show: boolean = false;
  @Output() refreshClicked = new EventEmitter<void>();

  constructor(private tokenTimerService: TokenTimerService) {}

  dismiss() {
    this.show = false;
  }

  refreshToken() {
    // Emit the refresh event when the "Refresh Token" button is clicked
    this.refreshClicked.emit();
  }
}
