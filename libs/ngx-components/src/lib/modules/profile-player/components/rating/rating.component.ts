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
  @Input() rating: number = 0;
  @Input() colorClass = 'bg-yellow-500';
  @Input() sizeClass: 'lg' | 'md' | 'sm' = 'lg';

  @Output() valueChanged = new EventEmitter<number>();

  public availableItems: { value: number }[] = [];

  public get starSize() {
    switch (this.sizeClass) {
      case 'lg':
        return 2.5;
      case 'md':
        return 2;
      case 'sm':
        return 1.5;
      default:
        return 2;
    }
  }

  ngOnInit(): void {
    this.availableItems = Array(this.items)
      .fill(0)
      .map((_, i) => ({ value: i + 1 }));
  }

  public setRating(rating: number) {
    this.rating = rating;
    this.valueChanged.emit(rating);
  }
}
