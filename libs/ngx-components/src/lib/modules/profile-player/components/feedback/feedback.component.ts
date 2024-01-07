import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppError, INotifyProfile } from '@notify/interfaces';
import { FeedbackService, UtilsService } from '@notify/nfc-app-services';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
import { RatingComponent } from '../rating/rating.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RatingComponent],
  providers: [FeedbackService, UtilsService],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss', '../profile.styles.scss'],
})
export class FeedbackComponent implements OnInit {
  @Input({ required: true }) cf!: ComponentRef<FeedbackComponent>;
  @Input({ required: true }) profile!: INotifyProfile;
  @Input({ required: true }) feedbackKey!: string;

  public rating = 0;
  public comment = '';
  public loading = false;

  constructor(
    private _feedbackService: FeedbackService,
    private _toastr: ToastrService,
    private _utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    disableBodyScroll(document.body);
  }

  public sendFeedback() {
    this.loading = true;
    this._feedbackService
      .sendFeedback(
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

  public close() {
    enableBodyScroll(document.body);
    this.cf.destroy();
  }

  public isSendDisabled() {
    return !this.rating || (this.rating < 4 && !this.comment.length);
  }
}
