import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { NFC } from 'capacitor-nfc';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'notify-nfc-write',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nfc-write.component.html',
  styleUrls: ['./nfc-write.component.scss'],
})
export class NfcWriteComponent implements OnInit {
  @Input() value = '';
  @Input() cf!: ComponentRef<NfcWriteComponent>;

  public progress$ = new BehaviorSubject({
    status: 'scanning',
    currentValue: '',
  });

  public ngOnInit(): void {
    this.scanNFC();
  }

  public async scanNFC() {
    await NFC.startScanning();

    NFC.addListener('nfcDetected', (tag) => {
      console.log('nfcDetected', tag);
      this.progress$.next({
        status: 'found',
        currentValue: tag,
      });
    });
  }

  public writeNFC() {
    this.progress$.next({
      status: 'writing',
      currentValue: this.progress$.value.currentValue,
    });
  }

  public close() {
    this.cf.destroy();
  }
}
