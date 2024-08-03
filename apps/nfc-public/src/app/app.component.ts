import { afterNextRender, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EcommerceService } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [RouterModule],
  providers: [EcommerceService],
  selector: 'notify-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private ecommerceService: EcommerceService) {
    afterNextRender(() => {
      this.ecommerceService.init();
    });
  }
}
