import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CapacitorService } from '../../../../services';
import { AvailableItemsComponent } from '../../components/available-items/available-items.component';

@Component({
  selector: 'notify-add-item-button',
  standalone: true,
  imports: [CommonModule, AvailableItemsComponent],
  providers: [CapacitorService],
  templateUrl: './add-item-button.component.html',
  styleUrls: [
    './add-item-button.component.scss',
    '../../advanced-profile.styles.scss',
  ],
})
export class AddItemButtonComponent {
  private _capacitorService = inject(CapacitorService);

  @ViewChild('loseFocus') loseFocus!: ElementRef<HTMLButtonElement>;
  @Output() addItem = new EventEmitter<FormGroup>();

  public get activeElement() {
    return document.activeElement;
  }

  public toggleState(event: MouseEvent): void {
    this._capacitorService.triggerHapticFeedback(
      this._capacitorService.hFeedbackStyles.Medium
    );

    if (this.activeElement?.id !== (event.target as HTMLButtonElement).id) {
      this.closeMenu();
    }
  }

  public closeMenu() {
    this.loseFocus.nativeElement.click();
    this.loseFocus.nativeElement.focus();
  }
}
