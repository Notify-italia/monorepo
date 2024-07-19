import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppError, INotifyProfile } from '@notify/interfaces';

import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
import {
  baseModalComponentProviders,
  ModalBaseComponent,
} from '../../../../constructors/modal.base.component';
import { FeedbackService, UtilsService } from '../../../../services';
import { RatingComponent } from '../rating/rating.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RatingComponent],
  providers: [FeedbackService, UtilsService, ...baseModalComponentProviders],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss', '../profile.styles.scss'],
})
export class FeedbackComponent extends ModalBaseComponent {
  @Input({ required: true }) profile!: INotifyProfile;
  @Input({ required: true }) feedbackKey!: string;

  public rating = 0;
  public comment = '';
  public loading = false;

  constructor(
    private _feedbackService: FeedbackService,
    private _toastr: ToastrService,
    private _utilsService: UtilsService
  ) {
    super();
  }

  public sendFeedback() {
    this.loading = true;
    this._feedbackService
      .postFeedback(
        {
          owner: this.profile.owner,
          rating: this.rating,
          comment: this.comment,
        },
        this.feedbackKey
      )
      .pipe(
        tap(() => {
          this._toastr.success('Feedback inviato', 'Grazie!');
          this.close();
        }),
        catchError(async (err: AppError) => {
          this.loading = false;
          return this._utilsService.errorHandler(err);
        })
      )
      .subscribe();
  }

  public isSendDisabled() {
    return !this.rating || (this.rating < 4 && !this.comment.length);
  }
}
