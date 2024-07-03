import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NfcTag, NfcUtils } from '@capawesome-team/capacitor-nfc';

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { BehaviorSubject, map } from 'rxjs';
import { ModalBaseComponent } from '../../../constructors/modal.base.component';
import { CapacitorService } from '../../../services';

export interface INotifyNFCStatus {
  status: 'scanning' | 'writing' | 'found' | 'written' | 'error';
  currentValue: NfcTag | null;
}

@Component({
  selector: 'notify-nfc-write',
  standalone: true,
  imports: [CommonModule],
  providers: [CapacitorService],
  templateUrl: './nfc-write.component.html',
  styleUrls: ['./nfc-write.component.scss'],
})
export class NfcWriteComponent extends ModalBaseComponent implements OnInit {
  @Input() items: { value: string; label: string }[] = [];
  @Input() questionLabel = '';
  @Input() confirmationLabel = '';
  @Input() playerBaseUrl = '';

  @Input() blurBackground = true;

  private _nfcUtils = new NfcUtils();
  public isAndroid = this._capacitorService.isAndroid;

  private get _parentElement() {
    return (this.cf.location.nativeElement as HTMLElement)
      .parentElement as HTMLElement;
  }

  public progressSubject$ = new BehaviorSubject<INotifyNFCStatus>({
    status: 'scanning',
    currentValue: null,
  });

  public progress$ = this.progressSubject$.pipe(
    map((v) => {
      //decodes the nfc tag to see if it has a profile url in it
      const hasProfile =
        (v.currentValue?.message?.records
          .map((r) => {
            return this._nfcUtils
              .convertBytesToString({ bytes: r.payload || [] })
              ?.text.includes(this.playerBaseUrl);
          })
          .filter((v) => v).length || 0) > 0;

      return { ...v, isWritable: v.currentValue?.isWritable, hasProfile };
    })
  );

  // constructor(private _capacitorService: CapacitorService) {
  //   super();
  // }

  ngOnInit(): void {
    disableBodyScroll(this._parentElement, {
      reserveScrollBarGap: true,
    });
    this.read();
  }

  public async writeNFC(value: string) {
    this.progressSubject$.next({
      status: 'writing',
      currentValue: this.progressSubject$.value.currentValue,
    });

    if (!this._capacitorService.isNative) {
      return;
    }

    console.log(`writing nfc with value: ${value}`);

    const ndef = this._capacitorService.prepareURINDEF(value);

    await this._capacitorService.scanNFCTag(async (nfc) => {
      try {
        await nfc.write({
          message: {
            records: [ndef],
          },
        });

        this.progressSubject$.next({
          status: 'written',
          currentValue: this.progressSubject$.value.currentValue,
        });
      } catch (error) {
        console.log('error writing nfc', error);
        this.progressSubject$.next({
          status: 'error',
          currentValue: this.progressSubject$.value.currentValue,
        });
      }
    });
  }

  public async read() {
    if (!this._capacitorService.isNative) {
      return;
    }

    await this._capacitorService.scanNFCTag((nfc, tag, source) => {
      if (source === 'scanSessionCanceled') {
        this.close();
        return;
      }

      if (source === 'scanSessionError' || !tag) {
        this.progressSubject$.next({
          status: 'error',
          currentValue: null,
        });
        return;
      }

      this.progressSubject$.next({
        status: 'found',
        currentValue: tag,
      });
    });
  }

  override onClose(): void {
    enableBodyScroll(this._parentElement);
  }
}
