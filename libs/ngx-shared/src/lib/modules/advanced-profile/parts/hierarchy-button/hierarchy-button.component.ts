import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INotifyProfile, NotifyAdvancedProfileItem } from '@notify/interfaces';
import { AvailableItemsComponent } from '../../components/available-items/available-items.component';
import { HierarchyComponent } from '../../components/hierarchy/hierarchy.component';

@Component({
  selector: 'notify-hierarchy-button',
  standalone: true,
  imports: [
    CommonModule,
    AvailableItemsComponent,
    HierarchyButtonComponent,
    HierarchyComponent,
  ],
  templateUrl: './hierarchy-button.component.html',
  styleUrls: ['../../advanced-profile.styles.scss'],
})
export class HierarchyButtonComponent {
  @ViewChild('LoseBlur') loseBlur!: ElementRef<HTMLButtonElement>;
  @Input({ required: true }) hierarchy!: NotifyAdvancedProfileItem[];
  @Input() requiredItems: string[] = [];
  @Input({ required: true }) selectedHierarchyItem!: string;
  @Input({ required: true }) profile!: INotifyProfile;

  @Output() addItem = new EventEmitter<FormGroup>();
  @Output() hierarchyChanged = new EventEmitter<NotifyAdvancedProfileItem[]>();
  @Output() selectedHierarchyItemChanged = new EventEmitter<string>();
  @Output() toggleReviewProfile = new EventEmitter<boolean>();
}
