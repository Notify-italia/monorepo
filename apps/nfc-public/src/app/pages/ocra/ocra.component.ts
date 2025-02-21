import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { TailwindFormsModule } from '@notify/ngx-shared';
import { FooterComponent } from '../../components/footer/footer.component';
import { FundedByComponent } from '../../sections/funded-by/funded-by.component';

@Component({
  selector: 'notify-ocra',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    FundedByComponent,
    TailwindFormsModule,
  ],
  templateUrl: './ocra.component.html',
  styleUrl: './ocra.component.scss',
})
export class OcraComponent {
  private _title = inject(Title);
  private _meta = inject(Meta);

  public inputElementsCss =
    'bg-gray-100 focus:ring-2 ring-accent-color rounded-2xl pl-4 py-6 !outline-none ring-offset-2 w-full smooth hover:brightness-90 backdrop-blur';

  public leadForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });

  constructor() {
    this._title.setTitle('ocr.a (by Notify)');
    this._meta.updateTag({
      name: 'description',
      content:
        'ocr.a è l’app definitiva per digitalizzare i tuoi biglietti da visita in pochi secondi. Grazie alla tecnologia OCR avanzata, estrai automaticamente nomi, numeri, email e dettagli importanti con una semplice foto. Organizza i contatti in modo smart e ritrovali facilmente quando ne hai bisogno. Dì addio ai biglietti di carta persi: con OCRA, il networking è più semplice, veloce ed efficace. Prova OCRA in anteprima e non perdere mai più un contatto!',
    });

    this._meta.updateTag({
      name: 'og:title',
      content: 'ocr.a (by Notify)',
    });

    this._meta.updateTag({
      name: 'og:description',
      content:
        'ocr.a è l’app definitiva per digitalizzare i tuoi biglietti da visita in pochi secondi. Grazie alla tecnologia OCR avanzata, estrai automaticamente nomi, numeri, email e dettagli importanti con una semplice foto. Organizza i contatti in modo smart e ritrovali facilmente quando ne hai bisogno. Dì addio ai biglietti di carta persi: con OCRA, il networking è più semplice, veloce ed efficace. Prova OCRA in anteprima e non perdere mai più un contatto!',
    });

    this._meta.updateTag({
      name: 'og:image',
      content: '/assets/ocra/ocra.webp',
    });
  }
}
