import { Component, inject } from '@angular/core';

import { INotifyAPAvatarItem, INotifyAPFeedbackItem } from '@notify/interfaces';
import { catchError, tap } from 'rxjs';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
} from '../../../../constructors/ap-item.form.base.component';
import { SvgBoxIcon, SvgboxService } from '../../../../services';
import { IconSelectorComponent } from '../../../../standalones/icon-select/icon-selector.component';
import { FEEDBACK_ICON_SET } from './feedback.iconset';

@Component({
  standalone: true,
  imports: [...AdvancedItemFormBaseImports, IconSelectorComponent],
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: `
    @if(this.context.getters.isRequired()) {
    <div class="w-full text-center">
      Blocco non modificabile, in quanto obbligatorio
    </div>

    } @else {
    <div class="flex space-x-2 items-center">
      <notify-icon-selector
        class="items-end mt-6"
        [icon]="form.controls['icon'].value"
        (iconChange)="setIcon($event)"
        [iconSet]="feedbackIconSet"
        #IconSelector
      ></notify-icon-selector>
      <div class="divider divider-horizontal"></div>
      <div class="flex flex-col space-y-2 w-full">
        <notify-tailwind-input
          [compact]="true"
          [parent]="form"
          [showClearInput]="false"
          name="caption"
          placeholder="Inserisci un titolo"
          label=" "
        ></notify-tailwind-input>

        @if(IconSelector?.currentIcon?.name ==='google' && isCompany) {
        <button
          (click)="generateGoogleReviewLink()"
          class="btn text-white btn-primary bg-primary-500/40 brightness-90 z-10 btn-sm text-xs"
          data-theme="notifytheme"
          [disabled]="!companyName.length"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <span>{{
            form.value.url?.includes(googleReviewsBaseUrl)
              ? 'Aggiorna URL'
              : 'Genera URL'
          }}</span>
        </button>

        } @else {
        <notify-tailwind-input
          [compact]="true"
          [parent]="form"
          name="url"
          label=" "
          [showClearInput]="false"
          [prefix]="IconSelector?.currentIcon?.publicPrefix || ''"
          [placeholder]="
            IconSelector?.currentIcon?.placeholder || 'Inserisci un link'
          "
        ></notify-tailwind-input>

        }

        <a
          class="btn w-full btn-outline btn-sm "
          [ngClass]="{
          'pointer-events-none opacity-50': !currentUrl.length,
        }"
          [href]="currentPublicUrl"
          target="_blank"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            ></path>
            <path d="M15 3h6v6"></path>
            <path d="M10 14 21 3"></path>
          </svg>
          <span>Prova il link</span>
        </a>
      </div>
    </div>
    }
  `,
})
export class FeedbackFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPFeedbackItem> {
  private _svgBoxService = inject(SvgboxService);

  public feedbackIconSet = FEEDBACK_ICON_SET;
  public googleReviewsBaseUrl =
    'https://search.google.com/local/writereview?placeid=';

  public get currentUrl() {
    return this.form.controls['url'].value;
  }

  public get currentPublicUrl() {
    const icon = this._svgBoxService.getIcon(
      this.form.value.icon || '',
      this.feedbackIconSet
    );
    return this.context.services.utils.populateWebProtocol(
      icon?.prefix || 'https://',
      this.currentUrl
    );
  }

  public generateGoogleReviewLink() {
    return this.context.services.utils
      .getGooglePlaceId(this.companyName)
      .pipe(
        tap((placeId) => {
          this.form.controls['url'].setValue(
            `${this.googleReviewsBaseUrl}${placeId.result}`
          );
        }),
        catchError((err) => this.context.services.utils.errorHandler(err, null))
      )
      .subscribe();
  }

  public get companyName() {
    const avatarItem = this.context.getters
      .requiredItems()
      .find((item) => item.key === 'avatar');

    if (!avatarItem) {
      return '';
    }

    return (
      this.context
        .advancedProfile()
        ?.items?.find(
          (fg) => fg._id === avatarItem.value
        ) as INotifyAPAvatarItem
    )?.label;
  }

  public setIcon(e: { current: SvgBoxIcon | null; new: SvgBoxIcon | null }) {
    if (!e.new) {
      this.form.controls['icon'].setValue('');
      this.form.controls['url'].setValue('');
      return;
    }

    const newCaption = `Lascia una recensione su ${e.new.expanded}`;
    const eventCurrentCaption = `Lascia una recensione su ${
      e.current?.expanded || ''
    }`;
    const currentIcon = this.form.controls['icon'].value;
    const currentCaption = this.form.controls['caption'].value;

    if (newCaption !== currentCaption && currentIcon === e.new.name) {
      return;
    }

    this.form.controls['icon'].setValue(e.new.name);
    this.form.controls['url'].setValue('');

    if (eventCurrentCaption !== currentCaption && currentCaption?.length) {
      return;
    }

    this.form.controls['caption'].setValue(newCaption);
  }
}
