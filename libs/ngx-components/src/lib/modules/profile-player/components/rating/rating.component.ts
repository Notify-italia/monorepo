import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'notify-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  @Input() items: number = 5;
  @Input() currentValue: number = 0;
  @Input() colorClass = 'bg-yellow-500';
  @Input() sizeClass: 'lg' | 'md' | 'sm' = 'lg';

  @Output() valueChanged = new EventEmitter<number>();

  public availableItems: { value: number }[] = [];

  ngOnInit(): void {
    this.availableItems = Array(this.items)
      .fill(0)
      .map((_, i) => ({ value: i + 1 }));
  }

  public setRating(rating: number) {
    this.currentValue = rating;
    this.valueChanged.emit(rating);
  }
}
