import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { INotifyPopulatedLicense } from '@notify/interfaces';
import {
  IStripeInvoice,
  LicenseFormFullFactory,
  LoadingComponent,
  RootService,
  StripeService,
} from '@notify/ngx-shared';
import axios from 'axios';
import { HTML } from 'ngx-editor/lib/trustedTypesUtil';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subject, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent, FormsModule],
  providers: [LicenseFormFullFactory],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private _stripeService = inject(StripeService);
  private _licenseFormFull = inject(LicenseFormFullFactory);
  private _toastr = inject(ToastrService);
  private _rootService = inject(RootService);
  private _domSanitizer = inject(DomSanitizer);

  public invoices$ = this._stripeService.getInvoices();

  public stripeInvoice$ = new Subject<IStripeInvoice>();
  public loading = false;
  public invoiceId = '';
  public orderStatus = '';

  public S3EmailTemplates: {
    [key: string]: string;
  } = {
    meetingRequired: 'emailMeetingRequired',
    licenseCreated:
      'https://s3-api.vps.notifyapp.it/assets/backoffice/email-templates/license-created-email.html?cache=12331',
    shipped:
      'https://s3-api.vps.notifyapp.it/assets/backoffice/email-templates/order-sent-email.html',
  };

  public emailCustomField: {
    definition:
      | {
          name: string;
          id: string;
        }
      | null
      | undefined;
    emailContent?: string;
    value?: string;
  } = {
    definition: null,
    value: '',
  };

  public orderStatuses = [
    {
      value: 'meetingRequired',
      label: 'Ordine Confermato',
    },
    {
      value: 'meetingRequired',
      label: 'Contatto Richiesto',
    },
    {
      value: 'licenseCreated',
      label: 'Licenza Creata',
      customField: {
        name: 'Chiave Licenza',
        id: 'licenseCode',
      },
    },
    {
      value: 'shipped',
      label: 'Tessere Spedite',
      customField: {
        name: 'Codice Tracking',
        id: 'trackingCode',
      },
    },
  ];

  public get currentEmailTemplate() {
    return this._domSanitizer.bypassSecurityTrustHtml(
      this._personalizedEmailTemplate
    );
  }

  private get _personalizedEmailTemplate() {
    return (this.emailCustomField?.emailContent || '')
      .replace(
        '[CODICE_LICENZA]',
        this.emailCustomField.value || '[CODICE_LICENZA]'
      )
      .replace(
        '[TRACKING_TESSERE]',
        this.emailCustomField.value || '[TRACKING_TESSERE]'
      );
  }

  public getInvoice() {
    this.loading = true;
    return this._stripeService
      .getInvoice(this.invoiceId)
      .pipe(
        tap((invoice) => {
          this.stripeInvoice$.next(invoice);
          this.loading = false;
        }),
        catchError(() => {
          this.loading = false;
          return [];
        })
      )
      .subscribe();
  }

  public openLicenseForm(license?: INotifyPopulatedLicense): void {
    const ref = this._licenseFormFull.create();

    ref.instance.submitted
      .pipe(
        switchMap((v) =>
          license
            ? this._rootService.patchLicense(v, license._id).pipe(
                tap(() => {
                  this._toastr.success('Licenza modificata');
                })
              )
            : this._rootService.postLicense(v).pipe(
                tap((v) => {
                  navigator.clipboard.writeText(v.publicKey);
                  this._toastr.success('Chiave copiata negli appunti');
                })
              )
        )
      )
      .subscribe();
  }

  public sendStatusUpdate(email: string) {
    const confirmed = confirm(
      `Sei sicuro di voler inviare questa email a ${email}?`
    );
    if (!confirmed) {
      return;
    }

    this.loading = true;
    this._rootService
      .sendEmail({
        address: 'stefano.vecchietti.99@gmail.com',
        title: 'Nuovo aggiornamento del tuo ordine Notify!',
        content: this._personalizedEmailTemplate,
      })
      .pipe(
        tap(() => {
          this.loading = false;
          this._toastr.success('Email inviata');
          console.log('Email inviata');
          this.invoiceId = '';
          this.orderStatus = '';
          this.emailCustomField = {
            definition: null,
          };
        }),
        catchError(() => {
          this.loading = false;
          this._toastr.error("Errore nell'invio dell'email");
          return [];
        })
      )
      .subscribe();
  }

  public async setEmailCustomField(invoice: IStripeInvoice) {
    if (!this.orderStatus) {
      this.emailCustomField = {
        definition: null,
      };
      return;
    }

    const emailCustomField = this.orderStatuses.find(
      (status) => status.value === this.orderStatus
    )?.customField;
    this.emailCustomField = {
      definition: emailCustomField,
      value: '',
      emailContent: (await this._getEmailTemplate()).replace(
        '[NOME CLIENTE]',
        invoice.customer_name.split(' ')[0] + '!'
      ),
    };
  }

  private async _getEmailTemplate() {
    const template = (
      await axios.get(this.S3EmailTemplates[this.orderStatus] as string)
    ).data as HTML;
    return template.toString();
  }
}
