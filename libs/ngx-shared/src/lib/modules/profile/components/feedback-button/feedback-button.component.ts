import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyFeedback, INotifyProfile } from '@notify/interfaces';
import { FeedbackService } from '../../../../services';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'notify-feedback-button',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  providers: [FeedbackService],
  templateUrl: './feedback-button.component.html',
  styleUrl: './feedback-button.component.scss',
})
export class FeedbackButtonComponent {
  @Input({ required: true }) data?: INotifyProfile;
  @Input() isAgent = false;
  @Input() feedbackKey = 'feedback';
  @Input() cssElementsColor = '#000000';

  @Output() feedbackClicked = new EventEmitter<void>();

  constructor(private _feedbackService: FeedbackService) {}

  public feedbackGiven(): INotifyFeedback | null {
    if (!this.data?._id) {
      return null;
    }

    const fb = this._feedbackService.getFeedbackFromLocalStorage(
      this.data?.owner,
      this.feedbackKey
    );

    return fb;
  }

  public redirectToReview(): void {
    if (!this.data?.reviewRedirect) {
      return;
    }

    window.open(this.data.reviewRedirect, '_blank');
  }

  public getContrastingColor(color: string, styleProp: string) {
    //return white or black, depending on the one that contrasts the most with the given color

    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const yiq = (r * 299 + g * 587 + b * 114) / 1000; // Calculate the perceptive luminance (aka luma) - human eye favors green color...
    const value = yiq >= 128 ? 'black' : 'white'; // ... So we'll use that as the benchmark.

    return { [styleProp]: value };
  }
}
