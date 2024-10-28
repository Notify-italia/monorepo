import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'notify-funded-by',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funded-by.component.html',
  styleUrl: './funded-by.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundedByComponent {
  public funds = [
    {
      name: 'Fondazione Monte dei Paschi di Siena',
      logo: 'assets/funders/fmps.webp',
      url: 'https://www.fondazionemps.it/',
    },
    {
      name: 'Regione Toscana',
      logo: 'assets/funders/toscana.webp',
      url: 'https://www.regione.toscana.it/',
    },
    {
      name: 'IKIGAI',
      logo: 'assets/funders/ikigai.webp',
      url: 'https://www.ikigaihub.it/ikigai-toscana/',
    },
    {
      name: 'Pluriversum',
      logo: 'assets/funders/pluriversum.webp',
      url: 'https://www.pluriversum.eu/',
    },
  ];
}
