import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'notify-lead-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.scss',
})
export class LeadDetailComponent {
  private _activatedRoute = inject(ActivatedRoute);

  public id = this._activatedRoute.snapshot.queryParams['l'];
}
