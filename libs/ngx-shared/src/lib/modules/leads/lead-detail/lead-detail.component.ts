import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { INotifyPopulatedLead } from '@notify/interfaces';
import {
  FormsService,
  LeadsService,
  controlsFromObject,
} from '../../../services';
import { LoadingComponent, PageHeaderComponent } from '../../../standalones';

@Component({
  selector: 'notify-lead-detail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LoadingComponent],
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

  ngOnInit(): void {
    this._leadsService.getLead(this.id).subscribe((lead) => {
      this.form = this._formsService.createFormGroup(lead);
    });
  }
}
