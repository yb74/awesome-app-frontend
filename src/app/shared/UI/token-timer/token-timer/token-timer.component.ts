import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-token-timer',
  templateUrl: './token-timer.component.html',
  styleUrls: ['./token-timer.component.css']
})
export class TokenTimerComponent {
  @Input() message: string = '';
  @Input() show: boolean = false;

  dismiss() {
    this.show = false;
  }
}
