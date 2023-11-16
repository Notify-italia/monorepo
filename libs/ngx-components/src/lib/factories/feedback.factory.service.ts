import { Injectable, createComponent } from '@angular/core';
import { FeedbackComponent } from '../standalone/profile-player/feedback/feedback.component';

@Injectable({
  providedIn: 'root',
})
export class FeedbackFactoryService {
  public show() {
    const ref = createComponent(FeedbackComponent);
  }
}
