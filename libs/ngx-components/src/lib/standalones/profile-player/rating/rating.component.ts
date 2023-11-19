import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'notify-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent {
  @Input() items: { value: number }[] = [];
  @Input() currentValue: number = 0;
  @Output() valueChanged = new EventEmitter<number>();

  public setRating(rating: number) {
    this.currentValue = rating;
    this.valueChanged.emit(rating);
  }
}
