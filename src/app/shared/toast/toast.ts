import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent {

  message = signal('');
  visible = signal(false);

  private hideTimer: any;

  show(message: string) {

    this.message.set(message);
    this.visible.set(true);

    clearTimeout(this.hideTimer);

    this.hideTimer = setTimeout(() => {
      this.visible.set(false);
    }, 3000);

  }

}