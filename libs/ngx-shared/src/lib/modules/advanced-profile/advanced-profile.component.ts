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
import { CachedSrcDirective } from '../../directives';
import { FormsService, ProfileService, UtilsService } from '../../services';
import { LoadingComponent } from '../../standalones';
import { ProfileViewComponent } from '../profile';
import { ADVANCED_PROFILE_PAGE_SETTINGS_DEFAULTS } from './items/page/page.form.component';
import { AddItemButtonComponent } from './parts/add-item-button/add-item-button.component';
import { InfoPanelComponent } from './parts/info-panel/info-panel.component';
import { LeftPanelComponent } from './parts/left-panel/left-panel.component';
import { RightPanelComponent } from './parts/right-panel/right-panel.component';
import { AdvancedProfileItemOutputsService } from './services/advanced-profile-item-outputs.service';

@Component({
  selector: 'notify-advanced-profile',
  standalone: true,
  imports: [
    CommonModule,
    LeftPanelComponent,
    RightPanelComponent,
    LoadingComponent,
    ProfileViewComponent,
    CachedSrcDirective,
    AddItemButtonComponent,
    InfoPanelComponent,
  ],
  providers: [FormsService, UtilsService, ProfileService],
  templateUrl: './advanced-profile.component.html',
  styleUrl: './advanced-profile.styles.scss',
})
export class AdvancedProfileComponent implements OnInit, OnDestroy {
  //services
  private _route = inject(ActivatedRoute);
  private _profileSerivce = inject(ProfileService);
  private _formsSerivce = inject(FormsService);
  private _advancedProfileItemOutputsService = inject(
    AdvancedProfileItemOutputsService
  );
  private _utilsService = inject(UtilsService);

  //observables
  private _profileSubject = new Subject<INotifyProfile>();
  public profile$: Observable<INotifyProfile> = this._profileSubject;

  //properties
  public loading = false;
  public form?: FormGroup;
  public selectedHierarchyItem = '';
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

    this._advancedProfileItemOutputsService.itemClicked
      .pipe(
        takeUntil(this.destroy$),
        tap((v) => {
          this.selectedHierarchyItem = v.item._id;
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

  public removeItem(item: string) {
    const itemsFa = this.form?.controls['items'] as FormArray<FormGroup>;
    itemsFa.removeAt(
      itemsFa.controls.findIndex((fg) => fg.controls['_id'].value === item)
    );
    this.selectedHierarchyItem = '';
  }

  public hierarchyChanged(hierarchy: NotifyAdvancedProfileItem[]) {
    (this.form as FormGroup)?.setControl(
      'items',
      this._formsSerivce.createFormArray(hierarchy)
    );
  }

  public normalizeURL(url: string | null) {
    if (!url) {
      url = 'https://notifyapp.it';
    }

    return this._utilsService.populateWebProtocol('https://', url);
  }

  public refreshProfile() {
    this.loading = true;
    return this._profileSerivce.getProfile(this.providedId).pipe(
      tap((v) => this._profileSubject.next(v)),
      tap(() => (this.loading = false))
    );
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

  public toggleProfileRedirect(value: boolean, profile: INotifyProfile) {
    this.loading = true;
    const parsedProfile = {
      ...profile,
      config: {
        ...profile.config,
        redirectEnabled: value,
      },
      redirectUrl: '',
    };
    this._profileSerivce
      .patchProfile(parsedProfile)
      .pipe(
        tap(() => {
          this._profileSubject.next(parsedProfile);
          this.selectedHierarchyItem = 'background';
          this.loading = false;
        })
      )
      .subscribe();
  }
}

const PROFILE_DEFAULTS: Partial<INotifyProfile> = {
  advancedProfile: {
    enabled: true,
    pageSettings: ADVANCED_PROFILE_PAGE_SETTINGS_DEFAULTS,
    items: [],
    requiredItems: {
      avatar: '',
      feedback: '',
    },
  },
};
