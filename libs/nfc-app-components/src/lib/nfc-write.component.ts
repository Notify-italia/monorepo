import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
  public isWriting$ = new BehaviorSubject({
    status: false,
  });

  public ngOnInit(): void {
    this.scanNFC();
  }

  public async scanNFC() {
    /*
    TODO - Implementare la lettura del tag NFC 
     */
  }

  public writeNFC() {
    /*
    TODO - Implementare la scrittura del tag NFC 
     */
  }
}
