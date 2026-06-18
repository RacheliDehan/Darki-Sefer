import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogStore } from '../catalog/store/catalog.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(public readonly catalogStore: CatalogStore) {}
}
