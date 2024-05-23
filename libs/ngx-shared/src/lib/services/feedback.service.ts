import { Injectable } from '@angular/core';
import { INotifyFeedback } from '@notify/interfaces';
import { tap } from 'rxjs';
import { HttpService } from './http.service';

@Injectable()
export class FeedbackService {
  constructor(private http: HttpService) {}

  public postFeedback(body: Partial<INotifyFeedback>, feedbackKey: string) {
    return this.http
      .post<Partial<INotifyFeedback>, INotifyFeedback>(`/v1/feedback`, body)
      .pipe(
        tap((feedback) => {
          this._saveToLocalStorage(feedback, feedbackKey);
        })
      );
  }

  public getFeedbacks(period: { from: Date; to: Date }, owner?: string) {
    const params: {
      from: string;
      to: string;
      owner?: string;
    } = {
      from: period.from.toISOString(),
      to: period.to.toISOString(),
    };

    if (owner) {
      params.owner = owner;
    }

    return this.http.get<INotifyFeedback[]>('/v1/feedback', params);
  }

  public getFeedbackFromLocalStorage(
    owner: INotifyFeedback['owner'],
    feedbackKey: string
  ): INotifyFeedback | null {
    return JSON.parse(localStorage.getItem(feedbackKey) || '[]').find(
      (feedback: INotifyFeedback) => feedback.owner === owner
    );
  }

  private _saveToLocalStorage(feedback: INotifyFeedback, feedbackKey: string) {
    const feedbacks = JSON.parse(localStorage.getItem(feedbackKey) || '[]');
    feedbacks.push(feedback);
    localStorage.setItem(feedbackKey, JSON.stringify(feedbacks));

    console.log('saved to local storage', feedbacks, feedbackKey);
  }
}
