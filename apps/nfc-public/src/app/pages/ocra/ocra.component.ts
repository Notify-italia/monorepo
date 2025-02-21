import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  HttpService,
  SSRBaseComponent,
  TailwindFormsModule,
} from '@notify/ngx-shared';
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
    ReactiveFormsModule,
  ],
  templateUrl: './ocra.component.html',
  styleUrl: './ocra.component.scss',
})
export class OcraComponent extends SSRBaseComponent {
  private _title = inject(Title);
  private _meta = inject(Meta);
  private _httpService = inject(HttpService);
  private _router = inject(Router);

  public inputElementsCss =
    'bg-ocra-secondary  focus:ring-2 ring-ocra-accent rounded-2xl pl-4 py-6 !outline-none ring-offset-2 w-full smooth hover:brightness-90 backdrop-blur';

  public leadForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    message: new FormControl('Ottenuto tramite sito web di ocr.a'),
  });

  constructor() {
    super();
    this.preloadImages([
      '/assets/ocra/ocra.webp',
      '/assets/ocra/mockup-dark.svg',
      '/assets/ocra/mockup-dark-mobile.svg',
    ]);
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

    this._meta.updateTag({
      name: 'theme-color',
      content: '#121212',
    });
  }

  public async submitLead() {
    this._httpService
      .post(
        '/v1/sales/collect',
        {
          d: Buffer.from(JSON.stringify(this.leadForm.value)).toString(
            'base64'
          ),
        },
        {}
      )
      .subscribe(() => {
        this._router.navigate(['/pages/ocra/success']);
        this.leadForm.reset();
      });
  }
}
