import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { Nfc, NfcTag, NfcUtils } from '@capawesome-team/capacitor-nfc';
import { CapacitorService } from '@notify/nfc-app-services';
import { BehaviorSubject, map } from 'rxjs';

export interface INotifyNFCStatus {
  status: 'scanning' | 'writing' | 'found';
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
export class NfcWriteComponent implements OnInit {
  @Input() value = '';
  @Input() profilesUrl = '';
  @Input() cf!: ComponentRef<NfcWriteComponent>;

  private _nfcUtils = new NfcUtils();

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
              ?.text.includes(`${this.profilesUrl}/profile?p=`);
          })
          .filter((v) => v).length || 0) > 0;

      return { ...v, isWritable: v.currentValue?.isWritable, hasProfile };
    })
  );

  constructor(private _capacitorService: CapacitorService) {}

  ngOnInit(): void {
    this.read();
  }

  public writeNFC() {
    this.progressSubject$.next({
      status: 'writing',
      currentValue: this.progressSubject$.value.currentValue,
    });
  }

  public read() {
    if (!this._capacitorService.isNative) {
      return;
    }

    return new Promise((resolve) => {
      Nfc.addListener('nfcTagScanned', async (event) => {
        await Nfc.stopScanSession();
        resolve(event.nfcTag);

        this.progressSubject$.next({
          status: 'found',
          currentValue: event.nfcTag,
        });
      });

      Nfc.startScanSession();
    });
  }

  public close() {
    this.cf.destroy();
  }
}
