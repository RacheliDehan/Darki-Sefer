import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogStore } from '../catalog/store/catalog.store';
import { ROUTES } from '../../core/constants/routes.constants';
import { RouterModule } from '@angular/router';
import { BooksSliderComponent } from '../books-slider/books-slider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BooksSliderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './home2.component.scss']
})
export class HomeComponent {
  constructor(public readonly catalogStore: CatalogStore) {}
    public readonly routes = ROUTES;

  contactForm = {
    name: '',
    institution: '',
    phone: '',
    email: ''
  };



}
