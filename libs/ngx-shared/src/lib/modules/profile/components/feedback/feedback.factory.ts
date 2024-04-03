import { Injectable } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { BaseFactory } from '../../../../constructors/base.factory';
import { FeedbackComponent } from './feedback.component';

@Injectable()
export class FeedbackFactory extends BaseFactory {
  public create(config: { profile: INotifyProfile; feedbackKey: string }) {
    return this._createComponent(FeedbackComponent, config);
  }
}
