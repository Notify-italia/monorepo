import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { INotifyPopulatedLead } from '@notify/interfaces';
import {
  FormsService,
  LeadsService,
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
  ],
  providers: [LeadsService, FormsService],
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.scss',
})
export class LeadDetailComponent implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _leadsService = inject(LeadsService);
  private _formsService = inject(FormsService);

  public id = this._activatedRoute.snapshot.queryParams['l'];

  public form?: FormGroup<controlsFromObject<INotifyPopulatedLead>>;

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
    this._leadsService.getLead(this.id).subscribe((lead) => {
      this.form = this._formsService.createFormGroup(lead);
      console.log(this.form.controls);
    });
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

  public addPhoneNumber() {
    this.form?.controls.phoneNumbers.push(
      new FormGroup({
        [this.form.controls.phoneNumbers.controls.length]: new FormControl(''),
      } as any)
    );
  }
}
