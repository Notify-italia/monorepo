import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppError, INotifyProfile } from '@notify/interfaces';

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
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
export class FeedbackComponent extends ModalBaseComponent implements OnInit {
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

  ngOnInit(): void {
    disableBodyScroll(document.body);
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

  override onClose() {
    enableBodyScroll(document.body);
  }

  public isSendDisabled() {
    return !this.rating || (this.rating < 4 && !this.comment.length);
  }
}
