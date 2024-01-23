import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'notify-nfc-write',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nfc-write.component.html',
  styleUrls: ['./nfc-write.component.scss'],
})
export class NfcWriteComponent {
  @Input() value = '';
  @Input() cf!: ComponentRef<NfcWriteComponent>;

  public progress$ = new BehaviorSubject({
    status: 'scanning',
    currentValue: '',
  });

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
