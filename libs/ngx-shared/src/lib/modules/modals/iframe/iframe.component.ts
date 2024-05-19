import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalBaseComponent } from '../../../constructors';
import { CachedSrcDirective } from '../../../directives';
import { CapacitorService } from '../../../services';

@Component({
  standalone: true,
  imports: [CommonModule, CachedSrcDirective],
  providers: [CapacitorService],
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss'],
})
export class IFrameComponent extends ModalBaseComponent {
  @Input() url = '';
  @Input() title = 'IFrame';
}
