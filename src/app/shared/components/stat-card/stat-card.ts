import { Component, input } from '@angular/core';
import { Card } from '../card/card';

@Component({
  selector: 'app-stat-card',
  imports: [Card],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
  icon = input('📊');
  label = input('');
  value = input<string | number>('');
  trend = input<string | null>(null);
  trendPositive = input(true);
  tint = input('#4f5fd6');
}
