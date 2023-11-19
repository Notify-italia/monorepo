import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppError, INotifyProfile } from '@notify/interfaces';
import { FeedbackService } from '@notify/nfc-app-services';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
import { RatingComponent } from '../rating/rating.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RatingComponent],
  providers: [FeedbackService],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
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
    private _toastr: ToastrService
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
          const errorMsg =
            err?.error?.errors?.[0]?.message || 'Errore di invio feedback';

          this._toastr.error(errorMsg, 'Errore');
          this.loading = false;
        })
      )
      .subscribe();
  }

  public close() {
    enableBodyScroll(document.body);
    this.cf.destroy();
  }

  public isSendDisabled() {
    return !this.rating || (this.rating < 3 && !this.comment.length);
  }
}
