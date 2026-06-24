import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROUTES } from '../../core/constants/routes.constants';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public readonly year = new Date().getFullYear();
    public readonly routes = ROUTES;
}
