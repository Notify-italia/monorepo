import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarComponent } from '@notify/ngx-shared';
import { hidratedAgent } from '../../pages/analytics-detail/analytics-detail.component';

@Component({
  selector: 'notify-analyitics-detail-user-row',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './analyitics-detail-row.component.html',
  styleUrl: './analyitics-detail-row.component.scss',
})
export class AnalyiticsDetailRowComponent {
  @Input() public item?: hidratedAgent;
  @Input() public selected = false;
  @Input() public hasSelected = false;

  @Output() public selectedItem = new EventEmitter<hidratedAgent>();
}
