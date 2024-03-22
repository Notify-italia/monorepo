import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { INotifyFeedback } from '@notify/interfaces';
import { BrowseFeedbacksFactory } from '../../../../standalones/browse-feedbacks/browse-feedbacks.factory';
import { RatingComponent } from '../../../profile-player';

@Component({
  selector: 'notify-widget-feedback',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  providers: [BrowseFeedbacksFactory],
  templateUrl: './widget-feedback.component.html',
  styleUrls: ['./widget-feedback.component.scss', '../../widgets.styles.scss'],
})
export class WidgetFeedbackComponent {
  @Input() value = 1;
  @Input() title = 'Feedback';
  @Input() totalFeedbacksCount = 0;
  @Input() advanced?: { enabled: boolean; feedbacks: INotifyFeedback[] };

  public backgroundColor = 'transparent';

  public selectedRating = 0;

  public get advancedFeedbackAverage() {
    if (!this.advanced?.feedbacks?.length) {
      return this.value;
    }

    const total = this.advanced.feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );
    return (total / this.advanced.feedbacks.length).toFixed(1);
  }

  public get sortedFeedbacks() {
    const sortedFeedbacks: { [key: number]: INotifyFeedback[] } = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    if (!this.advanced?.feedbacks?.length) {
      return {
        iterable: Object.entries(sortedFeedbacks),
        sortedFeedbacks,
      };
    }

    this.advanced.feedbacks.forEach((feedback) => {
      sortedFeedbacks[feedback.rating].push(feedback);
    });

    return {
      iterable: Object.entries(sortedFeedbacks),
      sortedFeedbacks,
    };
  }

  constructor(private browseFeedbacksFactory: BrowseFeedbacksFactory) {}

  public browseFeedbacks(feedbacks: INotifyFeedback[]) {
    this.browseFeedbacksFactory.create(feedbacks);
  }

  public toNumber = (value: string) => Number(value);
}
