import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  @Input({ required: true }) cf!: ComponentRef<FeedbackComponent>;
  @Input({ required: true }) profile!: INotifyProfile;

  constructor() {}

  public rating = 0;

  public availableRatings = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];

  ngOnInit(): void {
    disableBodyScroll(document.body);
  }

  public setRating(rating: number) {
    this.rating = rating;
  }

  public close() {
    enableBodyScroll(document.body);
    this.cf.destroy();
  }
}
