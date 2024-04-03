import { Injectable } from '@angular/core';
import { INotifyFeedback } from '@notify/interfaces';
import { BaseFactory } from '../../constructors/base.factory';
import { BrowseFeedbacksComponent } from './browse-feedbacks.component';

@Injectable()
export class BrowseFeedbacksFactory extends BaseFactory {
  public create(feedbacks: INotifyFeedback[] = []) {
    return this._createComponent(BrowseFeedbacksComponent, {
      feedbacks,
    });
  }
}
