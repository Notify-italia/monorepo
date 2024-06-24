import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { EnumNotifyLeadOrigins, INotifyLead } from '@notify/interfaces';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  Subject,
  catchError,
  combineLatest,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  AuthService,
  CapacitorService,
  LeadsService,
  OpenAIService,
  UtilsService,
} from '../../../services';
import {
  LoadingComponent,
  PageHeaderComponent,
  SearchBarComponent,
} from '../../../standalones';
import { LeadCardComponent } from '../lead-card/lead-card.component';

@Component({
  selector: 'notify-leads-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    SearchBarComponent,
    InfiniteScrollModule,
    LeadCardComponent,
  ],
  providers: [CapacitorService, LeadsService, UtilsService, OpenAIService],
  templateUrl: './leads-list.component.html',
  styleUrl: './leads-list.component.scss',
})
export class LeadsListComponent implements OnInit {
  private _capacitorService = inject(CapacitorService);
  private _leadsService = inject(LeadsService);
  private _utilsService = inject(UtilsService);
  private _toastrService = inject(ToastrService);
  private _authService = inject(AuthService);
  private _openaiService = inject(OpenAIService);

  public isScanning = false;

  public leadsSubject$ = new Subject<INotifyLead[]>();
  private _currentChunk = new BehaviorSubject<number>(1);
  public filteredLeads$ = new Subject<INotifyLead[]>();
  public chunkedLeads$ = combineLatest([
    this.filteredLeads$,
    this._currentChunk,
  ]).pipe(
    switchMap(([leads, i]) => of(leads.slice(0, i * this._leadsChunkSize)))
  );

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

  private get _leadsChunkSize() {
    const result = this._utilsService.currentTailwindMediaQuery();

    if (['none', 'sm', 'md'].includes(result)) {
      return 3;
    }

    if (['lg', 'xl'].includes(result)) {
      return 6;
    }

    return 12;
  }

  public ngOnInit(): void {
    this._refreshLeads().subscribe();
  }

  public onFilteredLeadsChange(leads: INotifyLead[]) {
    console.log('onFilteredLeadsChange', leads.length);
    this._currentChunk.next(1);
    this.filteredLeads$.next(leads);
  }

  public triggerInfiniteScroll() {
    console.log('triggerInfiniteScroll');
    this._currentChunk.next(this._currentChunk.value + 1);
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
        this.leadsSubject$.next(leads);
      })
    );
  }
}
