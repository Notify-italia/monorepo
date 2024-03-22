import { Injectable, ViewContainerRef } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { FeedbackComponent } from '../components/feedback/feedback.component';

@Injectable()
export class FeedbackFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(config: { profile: INotifyProfile; feedbackKey: string }) {
    const ref = this.vcr.createComponent(FeedbackComponent);

    ref.setInput('profile', config.profile);
    ref.setInput('cf', ref);
    ref.setInput('feedbackKey', config.feedbackKey);

    return ref;
  }
}
