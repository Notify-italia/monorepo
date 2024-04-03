import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyAgent } from '@notify/interfaces';
import { AvatarComponent } from '@notify/ngx-shared';

@Component({
  selector: 'notify-analyitics-detail-user-row',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './analyitics-detail-row.component.html',
  styleUrl: './analyitics-detail-row.component.scss',
})
export class AnalyiticsDetailRowComponent {
  @Input() public item?: INotifyAgent;
  @Input() public selected = false;
  @Input() public hasSelected = false;

  @Output() public selectedItem = new EventEmitter<INotifyAgent>();
}
