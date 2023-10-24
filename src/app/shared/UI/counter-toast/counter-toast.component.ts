import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-counter-toast',
  templateUrl: './counter-toast.component.html',
  styleUrls: ['./counter-toast.component.css']
})
export class CounterToastComponent {
  @Input() showCountdownMsg: boolean = false;
  @Input() countdownMsg: string = '';

  hideCountdown(): void {
    this.showCountdownMsg = false;
  }
}
