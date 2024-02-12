import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  afterNextRender,
} from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { ProfileService, SSRDirective } from '@notify/nfc-app-services';
import { ProfileViewComponent } from '@notify/ngx-components';
import { Observable } from 'rxjs';

@Component({
  selector: 'notify-instructions',
  standalone: true,
  imports: [CommonModule, SSRDirective, ProfileViewComponent],
  providers: [ProfileService],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent {
  @Output() componentStable = new EventEmitter<void>();

  public isProfileReady = false;

  public demoProfile$!: Observable<INotifyProfile>;

  public steps = [
    {
      title: 'Abbonati',
      description:
        'Contatta il nostro team di vendite per richiedere subito le tessere personalizzate per la tua azienda, oltre che la licenza di Notify.',
    },
    {
      title: 'Iscriviti',
      description:
        'Vai su aziende.notifyapp.it, crea un account master e immetti la tua licenza dopo aver eseguito il login.',
    },
    {
      title: 'Esplora ',
      description:
        'Crea il tuo profilo aziendale e gli accounts per i tuoi dipendenti, distribuisci le tessere e inizia subito a rivoluzionare il tuo networking! 🤩',
    },
  ];

  constructor(private _profileService: ProfileService) {
    afterNextRender(() => {
      this.demoProfile$ = this._profileService.getProfile(
        '655805c8f5638dc5ef4b3590'
      );
    });
  }
}
