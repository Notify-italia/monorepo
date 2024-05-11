import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  EnumNotifyAPAlign,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPDirections,
  INotifyProfile,
  NOTIFY_AP_FONTS,
} from '@notify/interfaces';
import { Observable, Subject, tap } from 'rxjs';
import { FormsService, ProfileService } from '../../services';
import { LoadingComponent } from '../../standalones';
import { ProfileViewComponent } from '../profile';
import { LeftPanelComponent } from './parts/left-panel/left-panel.component';
import { RightPanelComponent } from './parts/right-panel/right-panel.component';

@Component({
  selector: 'notify-advanced-profile',
  standalone: true,
  imports: [
    CommonModule,
    LeftPanelComponent,
    RightPanelComponent,
    LoadingComponent,
    ProfileViewComponent,
  ],
  providers: [FormsService],
  templateUrl: './advanced-profile.component.html',
  styleUrl: './advanced-profile.styles.scss',
})
export class AdvancedProfileComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _profileSerivce = inject(ProfileService);
  private _formsSerivce = inject(FormsService);

  private _profileSubject = new Subject<INotifyProfile>();
  public profile$: Observable<INotifyProfile> = this._profileSubject;

  public loading = false;
  public environment: {
    profilesUrl: string;
  } = this._route.snapshot.data['environment'];

  public form?: FormGroup;

  public get providedId() {
    return this._route.snapshot.queryParamMap.get('p') || undefined;
  }

  public ngOnInit() {
    this.refreshProfile()
      .pipe(
        tap((v) => {
          this.form = new FormGroup({
            items: new FormArray([]),
            pageSettings: new FormGroup({
              backgroundType: this._createFormControl(
                v,
                'pageSettings.backgroundType'
              ),
              fill: this._createFormControl(v, 'pageSettings.fill'),
              textColor: this._createFormControl(v, 'pageSettings.textColor'),
              font: this._createFormControl(v, 'pageSettings.font'),
              gradient: new FormGroup({
                direction: this._createFormControl(
                  v,
                  'pageSettings.gradient.direction'
                ),
                colors: this._createFormControl(
                  v,
                  'pageSettings.gradient.colors'
                ),
              }),
              pattern: new FormGroup({
                pattern: this._createFormControl(
                  v,
                  'pageSettings.pattern.pattern'
                ),
                color: this._createFormControl(v, 'pageSettings.pattern.color'),
              }),
            }),
          });
        })
      )
      .subscribe();
  }

  public addItem(item: FormGroup) {
    (this.form?.get('items') as FormArray).push(item);
  }

  public refreshProfile() {
    this.loading = true;
    return (this.profile$ = this._profileSerivce
      .getProfile(this.providedId)
      .pipe(
        tap((v) => this._profileSubject.next(v)),
        tap(() => (this.loading = false))
      ));
  }

  private _createFormControl(profile: INotifyProfile, path: string) {
    return this._formsSerivce.createFormControl(
      profile,
      path,
      PROFILE_DEFAULTS
    );
  }
}

const PROFILE_DEFAULTS: Partial<INotifyProfile> = {
  advancedProfile: {
    enabled: true,
    pageSettings: {
      backgroundType: EnumNotifyAPBackgroundTypes.Fill,
      textColor: '#ffffff',
      font: NOTIFY_AP_FONTS.Poppins,
      fill: '',
      gradient: {
        direction: EnumNotifyAPDirections.Vertical,
        colors: [],
      },
      pattern: {
        pattern: '',
        color: '',
      },
      imgSrc: '',
      fontSize: 16,
      align: EnumNotifyAPAlign.Start,
    },
    items: [],
    requiredItems: {
      avatar: '',
    },
  },
};
