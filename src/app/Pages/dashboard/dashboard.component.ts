import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  orderCount: number = 120;  // Example count
  productCount: number = 250;  // Example count
  categoryCount: number = 10;  // Example count

}
