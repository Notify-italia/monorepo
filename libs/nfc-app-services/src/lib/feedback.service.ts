import { Injectable } from '@angular/core';
import { INotifyFeedback } from '@notify/interfaces';
import { tap } from 'rxjs';
import { HttpService } from './http.service';

@Injectable()
export class FeedbackService {
  constructor(private http: HttpService) {}

  public sendFeedback(body: Partial<INotifyFeedback>, feedbackKey: string) {
    return this.http
      .post<Partial<INotifyFeedback>, INotifyFeedback>(`/v1/feedback`, body)
      .pipe(
        tap((feedback) => {
          this._saveToLocalStorage(feedback, feedbackKey);
        })
      );
  }

  public getFeedbackFromLocalStorage(
    id: INotifyFeedback['_id'],
    feedbackKey: string
  ) {
    return JSON.parse(localStorage.getItem(feedbackKey) || '[]').find(
      (feedback: INotifyFeedback) => feedback._id === id
    );
  }

  private _saveToLocalStorage(feedback: INotifyFeedback, feedbackKey: string) {
    const feedbacks = JSON.parse(localStorage.getItem(feedbackKey) || '[]');
    feedbacks.push(feedback);
    localStorage.setItem(feedbackKey, JSON.stringify(feedbacks));

    console.log('saved to local storage', feedbacks, feedbackKey);
  }
}
