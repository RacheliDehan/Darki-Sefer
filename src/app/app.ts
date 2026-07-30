import { Component, signal ,HostListener} from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('d-sefer');


  
  // חסימת מקש ימני
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault();
  }

  // // חסימת קיצורי מקלדת
  // @HostListener('document:keydown', ['$event'])
  // onKeyDown(event: KeyboardEvent): void {

  //   const key = event.key.toLowerCase();

  //   // F12
  //   if (event.key === 'F12') {
  //     event.preventDefault();
  //     alert('פתיחת כלי המפתחים נחסמה על ידי האתר');
  //     return;
  //   }

  //   // Ctrl+U
  //   if (event.ctrlKey && key === 'u') {
  //     event.preventDefault();
  //     alert('פתיחת קוד המקור נחסמה על ידי האתר');
  //     return;
  //   }

  //   // Ctrl+Shift+I
  //   if (event.ctrlKey && event.shiftKey && key === 'i') {
  //     event.preventDefault();
  //     alert('פתיחת כלי המפתחים נחסמה על ידי האתר');
  //     return;
  //   }

  //   // Ctrl+Shift+J
  //   if (event.ctrlKey && event.shiftKey && key === 'j') {
  //     event.preventDefault();
  //     alert('פתיחת כלי המפתחים נחסמה על ידי האתר');
  //     return;
  //   }

  //   // Ctrl+Shift+C
  //   if (event.ctrlKey && event.shiftKey && key === 'c') {
  //     event.preventDefault();
  //     alert('פתיחת כלי המפתחים נחסמה על ידי האתר');
  //     return;
  //   }

  //   // Ctrl+S
  //   if (event.ctrlKey && key === 's') {
  //     event.preventDefault();
  //     alert('שמירת דף האינטרנט נחסמה על ידי האתר');
  //     return;
  //   }
  // }
}
