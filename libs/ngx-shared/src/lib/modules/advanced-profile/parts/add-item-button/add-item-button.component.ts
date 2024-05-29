import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AvailableItemsComponent } from '../../components/available-items/available-items.component';

@Component({
  selector: 'notify-add-item-button',
  standalone: true,
  imports: [CommonModule, AvailableItemsComponent],
  templateUrl: './add-item-button.component.html',
  styleUrls: [
    './add-item-button.component.scss',
    '../../advanced-profile.styles.scss',
  ],
})
export class AddItemButtonComponent {
  @ViewChild('LoseBlur') loseBlur!: ElementRef<HTMLButtonElement>;
  @Output() addItem = new EventEmitter<FormGroup>();

  public toggleState(event: MouseEvent): void {
    const activeElement = document.activeElement;

    if (activeElement?.id !== (event.target as HTMLButtonElement).id) {
      this.loseBlur.nativeElement.click();
      this.loseBlur.nativeElement.focus();
    }
  }
}
