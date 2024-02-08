import { Injectable, ViewContainerRef } from '@angular/core';
import { INotifyFeedback } from '@notify/interfaces';
import { BrowseFeedbacksComponent } from './browse-feedbacks.component';

@Injectable()
export class BrowseFeedbacksFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(feedbacks: INotifyFeedback[] = []) {
    const ref = this.vcr.createComponent(BrowseFeedbacksComponent);

    ref.setInput('cf', ref);
    ref.setInput('feedbacks', feedbacks);

    return ref;
  }
}
