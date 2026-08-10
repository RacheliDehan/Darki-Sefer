import {  Component,  ElementRef,  ViewChild} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-books-slider',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './books-slider.component.html',
  styleUrl: './books-slider.component.css'
})
export class BooksSliderComponent {

  @ViewChild('booksViewport')
  booksViewport!: ElementRef<HTMLDivElement>;


  scrollBooks(direction: 'left' | 'right'): void {

    const viewport = this.booksViewport.nativeElement;

    const book = viewport.querySelector('.book') as HTMLElement;

    if (!book) {
      return;
    }

    const gap = 15;

    const scrollAmount = book.offsetWidth + gap;

    viewport.scrollBy({
      left: direction === 'right'
        ? scrollAmount
        : -scrollAmount,

      behavior: 'smooth'
    });
  }

}