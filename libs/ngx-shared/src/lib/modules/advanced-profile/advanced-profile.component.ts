import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  INotifyAdvancedProfile,
  INotifyProfile,
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
import { ADVANCED_PROFILE_PAGE_SETTINGS_DEFAULTS } from './parts/background/background.form.component';
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
  //services
  private _route = inject(ActivatedRoute);
  private _profileSerivce = inject(ProfileService);
  private _formsSerivce = inject(FormsService);

  //observables
  private _profileSubject = new Subject<INotifyProfile>();
  public profile$: Observable<INotifyProfile> = this._profileSubject;

  //properties
  public loading = false;
  public form?: FormGroup;
  public selectedHierarchyItem = 'background';
  public environment: {
    profilesUrl: string;
  } = this._route.snapshot.data['environment'];

  private destroy$ = new Subject<void>();

  public get providedId() {
    return this._route.snapshot.queryParamMap.get('p') || undefined;
  }

  public get requiredItems() {
    return Object.values(this.form?.get('requiredItems')?.value) as string[];
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
        switchMap(() => {
          if (!this.form) {
            return of(null);
          }

          return this.form.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(500),
            switchMap((f) => {
              if (!f) {
                return of(null);
              }
              return this.saveProfile(f as INotifyAdvancedProfile);
            })
          );
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addItem(item: FormGroup) {
    (this.form?.get('items') as FormArray).push(item);
    this.selectedHierarchyItem = item.value._id;
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
    pageSettings: ADVANCED_PROFILE_PAGE_SETTINGS_DEFAULTS,
    items: [],
    requiredItems: {
      avatar: '',
    },
  },
};
