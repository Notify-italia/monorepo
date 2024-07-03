import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';
import { ModalBaseComponent } from '../../../../constructors';
import { FormsService, controlsFromObject } from '../../../../services';
import { RightPanelComponent } from '../right-panel/right-panel.component';

@Component({
  selector: 'notify-info-panel',
  standalone: true,
  imports: [CommonModule, RightPanelComponent],
  providers: [FormsService],
  templateUrl: './info-panel.component.html',
  styleUrl: './info-panel.component.scss',
})
export class InfoPanelComponent extends ModalBaseComponent {
  @Input({ required: true }) loading = false;
  @Input({ required: true }) profile!: INotifyProfile;
  @Input({ required: true }) environment!: Record<string, unknown>;
  @Input({ required: true }) form?: FormGroup<
    controlsFromObject<INotifyProfile['advancedProfile']>
  >;
  @Input({ required: true }) selectedHierarchyItem = 'background';

  @Output() forceSave = new EventEmitter<void>();
  @Output() closePanel = new EventEmitter<void>();
  @Output() removeItem = new EventEmitter<string>();
}
