import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type measureUnit = 'px' | 'rem' | 'em' | '%';
type measureValue = number;

type offsetValue = `${measureValue}${measureUnit}`;

@Component({
  selector: 'notify-floating-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-button.component.html',
  styleUrl: './floating-button.component.scss',
})
export class FloatingButtonComponent {
  @Input() iconRenderingMode: 'stroke' | 'fill' = 'fill';
  @Input() iconPath: string[] = [];
  @Input() label?: {
    base: string;
    lg: string;
  };
  @Input() small?: boolean;
  @Input() offsets?: {
    top?: offsetValue;
    right?: offsetValue;
    bottom?: offsetValue;
    left?: offsetValue;
  } = {
    top: '0rem',
    right: '0rem',
    bottom: '1.25rem',
    left: '0rem',
  };

  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();
}
