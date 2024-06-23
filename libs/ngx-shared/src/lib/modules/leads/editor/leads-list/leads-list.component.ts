import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EnumNotifyLeadOrigins, INotifyLead } from '@notify/interfaces';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, of, switchMap, tap } from 'rxjs';
import {
  AuthService,
  CapacitorService,
  LeadsService,
  OpenAIService,
  UtilsService,
} from '../../../../services';
import {
  LoadingComponent,
  PageHeaderComponent,
  SearchBarComponent,
} from '../../../../standalones';

@Component({
  selector: 'notify-leads-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    SearchBarComponent,
  ],
  providers: [CapacitorService, LeadsService, UtilsService, OpenAIService],
  templateUrl: './leads-list.component.html',
  styleUrl: './leads-list.component.scss',
})
export class LeadsListComponent {
  private _capacitorService = inject(CapacitorService);
  private _leadsService = inject(LeadsService);
  private _utilsService = inject(UtilsService);
  private _toastrService = inject(ToastrService);
  private _authService = inject(AuthService);
  private _openaiService = inject(OpenAIService);

  private _leadsSubject$ = new Subject<INotifyLead[]>();
  public leads$: Observable<INotifyLead[]> = this._leadsSubject$;

  public isScanning = false;

  public get availableButtons() {
    return [
      {
        label: 'Digitalizza biglietto da visita',
        eventName: 'requestBusinessCardScan',
        icon: [
          'M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z',
          'M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z',
        ],
      },
    ];
  }

  public async scanBusinessCard() {
    of(await this._capacitorService.takePhoto())
      .pipe(
        tap(() => (this.isScanning = true)),
        switchMap((photo) => this._uploadTempFile(photo.dataUrl, photo.format)),
        switchMap((r) => this._analyzeBusinessCard(r?.url)),
        switchMap((lead) => this._appendDominantColor(lead)),
        switchMap((lead) => this._createLead(lead)),
        switchMap(() => this._refreshLeads()),
        catchError((e) => this._utilsService.errorHandler(e)),
        tap(() => (this.isScanning = false))
      )
      .subscribe();
  }

  private _uploadTempFile(data: string | undefined, extension: string) {
    if (!data || !extension) {
      return of(null);
    }
    return this._utilsService.uploadTempFile(data, extension);
  }

  private _analyzeBusinessCard(url: string | undefined) {
    if (!url) {
      return of(null);
    }
    return this._openaiService.analyzeBusinessCard(url);
  }

  private _appendDominantColor(lead: INotifyLead | null) {
    //TODO post merge con develop, usare color-thief per estrarre il colore dominante
    return of(lead);
  }

  private _createLead(lead: INotifyLead | null) {
    if (!lead) {
      return of(null);
    }
    return this._leadsService
      .createLead({
        ...lead,
        origin: EnumNotifyLeadOrigins.BusinessCardOCRScan,
        createdBy: this._authService.user?._id || '',
        accepted: true,
      })
      .pipe(
        tap(() => {
          this._toastrService.success('Contatto aggiunto!');
        })
      );
  }

  private _refreshLeads() {
    return this._leadsService.getLeads().pipe(
      tap((leads) => {
        this._leadsSubject$.next(leads);
      })
    );
  }
}
