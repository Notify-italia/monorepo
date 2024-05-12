import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  EnumNotifyAPAlign,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPDirections,
  INotifyAdvancedProfile,
  INotifyProfile,
  NOTIFY_AP_FONTS,
  NotifyAdvancedProfileItem,
} from '@notify/interfaces';
import {
  Observable,
  Subject,
  debounceTime,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
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
export class AdvancedProfileComponent implements OnInit, OnDestroy {
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

  private destroy$ = new Subject<void>();

  public get providedId() {
    return this._route.snapshot.queryParamMap.get('p') || undefined;
  }

  public ngOnInit() {
    this.refreshProfile()
      .pipe(
        tap((v) => {
          this.form = this._formsSerivce.createFormGroup(
            v.advancedProfile,
            PROFILE_DEFAULTS.advancedProfile
          );
        }),
        switchMap(() =>
          (this.form?.valueChanges || of(null)).pipe(
            takeUntil(this.destroy$),
            debounceTime(500),

            switchMap((f) => this.saveProfile(f))
          )
        )
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addItem(item: FormGroup) {
    (this.form?.get('items') as FormArray).push(item);
  }

  public hierarchyChanged(hierarchy: NotifyAdvancedProfileItem[]) {
    this.form?.setControl(
      'items',
      this._formsSerivce.createFormArray(hierarchy)
    );
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

  public saveProfile(form: INotifyAdvancedProfile) {
    console.log(this.form?.controls);
    this.loading = true;
    return this._profileSerivce
      .patchProfile(
        {
          advancedProfile: form,
        },
        this.providedId
      )
      .pipe(tap(() => (this.loading = false)));
  }
}

const PROFILE_DEFAULTS: Partial<INotifyProfile> = {
  advancedProfile: {
    enabled: true,
    pageSettings: {
      backgroundType: EnumNotifyAPBackgroundTypes.Fill,
      textColor: '#ffffff',
      font: NOTIFY_AP_FONTS.Poppins,
      fill: '#000000',
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
      avatar: null,
    },
  },
};
