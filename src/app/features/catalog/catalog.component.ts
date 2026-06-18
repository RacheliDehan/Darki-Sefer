import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogStore } from './store/catalog.store';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {
  constructor(public readonly store: CatalogStore) {}

  onSearch(value: string): void {
    this.store.search.set(value);
  }

  selectCategory(id: string | null): void {
    this.store.selectedCategory.set(id);
  }
}
