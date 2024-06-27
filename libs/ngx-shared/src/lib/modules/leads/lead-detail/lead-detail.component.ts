import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  INotifyLead,
  INotifyPopulatedLead,
  UnknownType,
} from '@notify/interfaces';
import {
  Subject,
  catchError,
  debounceTime,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  FormsService,
  LeadsService,
  UtilsService,
  controlsFromObject,
} from '../../../services';
import {
  AvatarComponent,
  GoogleMapsComponent,
  LoadingComponent,
  PageHeaderComponent,
  SaveIndicatorComponent,
  SvgBoxIconComponent,
} from '../../../standalones';
import { TailwindFormsModule } from '../../tailwind-forms/tailwind-forms.module';
import { LeadCommentsFormComponent } from '../components/detail-sections/lead-comments-form.component';
import { LeadEmailsFormComponent } from '../components/detail-sections/lead-emails-form.component';
import { LeadPhoneNumbersFormComponent } from '../components/detail-sections/lead-phonenumbers-form.component';
import { LeadSocialsFormComponent } from '../components/detail-sections/lead-socials-form.component';

@Component({
  selector: 'notify-lead-detail',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    TailwindFormsModule,
    SvgBoxIconComponent,
    SaveIndicatorComponent,
    GoogleMapsComponent,
    AvatarComponent,
    LeadPhoneNumbersFormComponent,
    LeadEmailsFormComponent,
    LeadSocialsFormComponent,
    LeadCommentsFormComponent,
  ],
  providers: [LeadsService, FormsService, UtilsService],
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.scss',
})
export class LeadDetailComponent implements OnInit, OnDestroy {
  private _activatedRoute = inject(ActivatedRoute);
  private _leadsService = inject(LeadsService);
  private _formsService = inject(FormsService);
  private _utilsService = inject(UtilsService);

  public id = this._activatedRoute.snapshot.queryParams['l'];
  public form?: FormGroup<controlsFromObject<INotifyPopulatedLead>>;
  public saving = false;

  public destroy$ = new Subject<void>();

  public get isCompanyBusinessCard() {
    const v = this.form?.value;

    return (
      v?.company?.length &&
      !v.name?.length &&
      !v.surname?.length &&
      !v.role?.length
    );
  }

  ngOnInit(): void {
    this._getLead()
      .pipe(
        tap((v) => (this.form = this._formsService.createFormGroup(v))),
        tap(() => this._listenToFormChanges())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public googleSearch() {
    if (!this.form) {
      return;
    }
    const { company, address } = this.form.value;

    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(
        company + ' ' + address
      )}`,
      '_blank'
    );
  }

  public tripadvisorSearch() {
    if (!this.form) {
      return;
    }
    const { company } = this.form.value;

    window.open(
      `https://www.tripadvisor.com/Search?q=${encodeURIComponent(
        company || ''
      )}`,
      '_blank'
    );
  }

  public addEmailAddress() {
    this.form?.controls.emails.push(
      new FormGroup({
        [this.form.controls.emails.controls.length]: new FormControl(''),
      } as UnknownType)
    );
  }

  private _getLead() {
    if (!this.id) {
      return of();
    }

    return this._leadsService.getLead(this.id).pipe(
      tap((lead) => {
        this._updateFormControls(lead);
      })
    );
  }

  private _listenToFormChanges() {
    this.form?.valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$),
        switchMap(() => {
          if (!this.form) {
            return of();
          }
          return of(this._normalizeForm(this.form));
        }),
        tap(() => (this.saving = true)),
        switchMap((v) => this._leadsService.patchLead(v)),
        switchMap(() => this._getLead()),
        catchError((e) => this._utilsService.errorHandler(e)),
        tap(() => (this.saving = false))
      )
      .subscribe();
  }

  private _normalizeForm(
    v: FormGroup<controlsFromObject<INotifyPopulatedLead>>
  ): INotifyLead {
    const emails = ((v.value.emails as UnknownType[]) || []).map(
      (v: { [key: string]: string }) => v[Object.keys(v)[0]]
    );
    const phoneNumbers = ((v.value.phoneNumbers as UnknownType[]) || []).map(
      (v: { [key: string]: string }) => v[Object.keys(v)[0]]
    );
    const createdBy = v.value.createdBy?._id || '';
    const comments = (v.value.comments || []).map((v) => ({
      ...v,
      createdAt: new Date(v.createdAt || ''),
      content: v.content || '',
      createdBy: v.createdBy?._id || '',
    }));
    const sharedBy = ((v.value.sharedBy as UnknownType[]) || []).map(
      (v: { _id: string }) => v._id
    );

    return {
      ...v.value,
      emails,
      phoneNumbers,
      createdBy,
      comments,
      sharedBy,
      notifyProfile: v.value.notifyProfile?._id || null,
    } as UnknownType as INotifyLead;
  }

  private _updateFormControls(v: INotifyPopulatedLead) {
    if (!this.form) {
      return;
    }

    // this.form.controls.emails = this._formsService.createFormArray(emails) as UnknownType
    // this.form.controls.phoneNumbers = this._formsService.createFormArray(phoneNumbers) as UnknownType
    // this.form.controls.comments = this._formsService.createFormArray(v.comments) as UnknownType
    // this.form.controls.sharedBy = this._formsService.createFormArray(v.sharedBy) as UnknownType
    // this.form.controls.notifyProfile = this._formsService.createFormGroup(v.notifyProfile) as UnknownType

    Object.entries(
      this._formsService.createFormGroup({
        comments: v.comments,
        updatedAt: v.updatedAt,
      }).controls
    ).forEach((key) => {
      if (!this.form?.get(key[0])) {
        (this.form as UnknownType)?.addControl(key[0], key[1], {
          emitEvent: false,
        });
        return;
      }

      (this.form as UnknownType).setControl(key[0], key[1], {
        emitEvent: false,
      });
    });
  }
}
