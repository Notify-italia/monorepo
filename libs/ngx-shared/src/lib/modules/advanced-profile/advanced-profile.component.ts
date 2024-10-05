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
  withLatestFrom,
} from 'rxjs';
import { CachedSrcDirective } from '../../directives';
import {
  CapacitorService,
  FormsService,
  ProfileService,
  UtilsService,
} from '../../services';
import { LoadingComponent, SaveIndicatorComponent } from '../../standalones';
import {
  INotifyShareItemConfig,
  ProfilePlayerFactory,
  ProfileViewComponent,
  ShareItemComponent,
} from '../profile';
import { RedirectToggleButtonComponent } from './components/redirect-toggle-button/redirect-toggle-button.component';
import { ADVANCED_PROFILE_PAGE_SETTINGS_DEFAULTS } from './items/page/page.form.component';
import { AddItemButtonComponent } from './parts/add-item-button/add-item-button.component';
import { HierarchyButtonComponent } from './parts/hierarchy-button/hierarchy-button.component';
import { InfoPanelComponent } from './parts/info-panel/info-panel.component';
import { InfoPanelFactory } from './parts/info-panel/info-panel.factory';
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
    HierarchyButtonComponent,
    SaveIndicatorComponent,
    ShareItemComponent,
    RedirectToggleButtonComponent,
  ],
  providers: [
    FormsService,
    UtilsService,
    ProfileService,
    ProfilePlayerFactory,
    InfoPanelFactory,
    CapacitorService,
  ],
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
  private _profilePlayerFactory = inject(ProfilePlayerFactory);
  private _infoPanelFactory = inject(InfoPanelFactory);
  private _capacitorService = inject(CapacitorService);

  //observables
  private _profileSubject = new Subject<INotifyProfile>();
  public profile$: Observable<INotifyProfile> = this._profileSubject;
  public showProfile$: Subject<void> = new Subject();

  //properties
  public loading = false;
  public form?: FormGroup;
  public selectedHierarchyItem = '';
  public shareConfig?: INotifyShareItemConfig;
  public environment: {
    profilesUrl: string;
  } = this._route.snapshot.data['environment'];
  public updatedAt = new Date();
  private destroy$ = new Subject<void>();

  public get providedId() {
    return this._route.snapshot.queryParamMap.get('p') || undefined;
  }

  public get requiredItems() {
    return Object.values(this.form?.get('requiredItems')?.value) as string[];
  }

  public get editorHeight() {
    return this._utilsService.availableScreenHeight;
  }

  public ngOnInit() {
    this.refreshProfile()
      .pipe(
        tap((v) => {
          this.form = this._formsSerivce.createFormGroup(
            v.advancedProfile,
            PROFILE_DEFAULTS.advancedProfile
          );
          this.updatedAt = v.updatedAt;
        }),
        this._setShareConfigPipe(),
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
        withLatestFrom(this.profile$),
        debounceTime(250),
        tap(([v, p]) => this.selectedHierarchyItemChanged(v.item._id, p))
      )
      .subscribe();

    this._advancedProfileItemOutputsService.hierarchyChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe((v) => this.hierarchyChanged(v));

    this._providedProfileSubscription(this.providedId).subscribe();

    this.showProfile$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.profile$),
        tap(() =>
          this._capacitorService.triggerHapticFeedback(
            this._capacitorService.hFeedbackStyles.Medium
          )
        ),
        tap(([_, profile]) => this.showProfile(profile))
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addItem(item: FormGroup, profile: INotifyProfile) {
    (this.form?.get('items') as FormArray).push(item);

    this._capacitorService.triggerHapticFeedback(
      this._capacitorService.hFeedbackStyles.Success
    );

    this.selectedHierarchyItemChanged(item.value._id, profile, false);
  }

  public showProfile(profile: INotifyProfile) {
    const ref = this._profilePlayerFactory.create({
      profile: {
        ...profile,
        advancedProfile: this.form?.value,
      },
      baseUrl: this.environment.profilesUrl,
      hideShare: true,
      isRunningOnPlayer: false,
    });

    this.form?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((v) => {
          ref.instance.profile = {
            ...profile,
            advancedProfile: v,
          };
        })
      )
      .subscribe();
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

  public selectedHierarchyItemChanged(
    item: string,
    profile: INotifyProfile,
    triggerHaptic = true
  ) {
    this.selectedHierarchyItem = item;

    if (!this._utilsService.isMobile) {
      return;
    }

    if (triggerHaptic) {
      this._capacitorService.itemClickedHapticFeedback();
    }

    const ref = this._infoPanelFactory.create({
      loading: this.loading,
      profile,
      environment: this.environment,
      form: this.form as FormGroup,
      selectedHierarchyItem: item,
    });

    ref.instance.closePanel
      .pipe(
        takeUntil(ref.instance.destroyed$),
        tap(() => {
          this.selectedHierarchyItem = '';
          this._capacitorService.itemClickedHapticFeedback();
          ref.instance.close();
        })
      )
      .subscribe();

    ref.instance.forceSave
      .pipe(
        takeUntil(ref.instance.destroyed$),
        tap(() => this.saveProfile(this.form?.value))
      )
      .subscribe();

    ref.instance.removeItem
      .pipe(
        takeUntil(ref.instance.destroyed$),
        tap((v) => {
          {
            this.removeItem(v);
            ref.instance.close();
          }
        })
      )
      .subscribe();

    ref.instance.destroyed$
      .pipe(
        tap(() => {
          this.selectedHierarchyItem = '';
        })
      )
      .subscribe();
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
      .pipe(
        tap((v) => {
          this.loading = false;
          this.updatedAt = v.updatedAt;
        }),
        this._setShareConfigPipe()
      );
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
      .patchProfile(parsedProfile, this.providedId)
      .pipe(
        switchMap(() => this.refreshProfile()),
        tap((p) => {
          if (value) {
            this.selectedHierarchyItemChanged('background', p, false);
          }
          this.loading = false;
        })
      )
      .subscribe();
  }

  private _providedProfileSubscription(profile: string | undefined) {
    return this._route.queryParams.pipe(
      takeUntil(this.destroy$),
      tap((params) => {
        if (params['p'] !== profile) {
          //? questo è un workaround per forzare il refresh della pagina quando cambia il parametro p nella query string
          //così da permettere il passaggio seamless dalla modifica di un profilo utente al proprio profilo se si è una company
          location.reload();
        }
      })
    );
  }

  private _setShareConfigPipe() {
    return tap((v: INotifyProfile) => {
      const companyNfcItem = v.company
        ? [
            {
              value: v.company._id,
              label: 'Profilo Aziendale',
            },
          ]
        : [];

      this.shareConfig = {
        type: 'profile',
        qrcode: {
          title: 'Condividi il profilo',
          fileName: this._profileSerivce.getProfileName(v) || 'Profilo',
        },
        nfc: {
          items: [
            {
              value: v._id,
              label: 'Questo Profilo',
            },
            ...companyNfcItem,
          ],
        },
        baseUrl: this.environment['profilesUrl'] as string,
        isInModal: false,
        id: v.profileIdentifier || v?._id,
      };
    });
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
