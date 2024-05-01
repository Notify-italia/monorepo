import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { IonSpinner } from '@ionic/angular/standalone';
import { Spinner, SpinnerOptions } from 'spin.js';
import { CapacitorService } from '../../services';

@Component({
  selector: 'notify-pull-to-refresh',
  standalone: true,
  imports: [IonSpinner, CommonModule],
  providers: [CapacitorService],
  templateUrl: './pull-to-refresh.component.html',
  styleUrl: './pull-to-refresh.component.scss',
})
export class PullToRefreshComponent implements AfterViewInit, OnDestroy {
  @ViewChild('Spinner') spinner!: ElementRef<HTMLDivElement>;

  public capacitorService = inject(CapacitorService);
  private _gestureCtrl = inject(GestureController);
  private _renderer = inject(Renderer2);

  @Input() loading = false;
  @Output() refresh = new EventEmitter<void>();

  startY = 0;
  currentY = 0;
  threshold = 150; // Soglia di pull down in pixel
  change = 0;
  thresholdPassed = false;
  scrollValue = 0;

  private _gestureController: Gesture;

  constructor() {
    this._gestureController = this._gestureCtrl.create(
      {
        el: document.body.querySelector('notify-root') as HTMLElement,
        threshold: 15,

        direction: 'y',
        gestureName: 'pull-to-refresh',
        onStart: (event) => this.onTouchStart(event),
        onMove: (event) => this.onTouchMove(event),
        onEnd: () => this.onTouchEnd(),
      },
      true
    );

    if (!this.capacitorService.isNative) {
      return;
    }
    this._gestureController.enable(true);

    this._renderer.listen('window', 'scroll', () => {
      this.scrollValue = window.scrollY;

      if (this.scrollValue === 0) {
        this.startY = this.currentY;
      }
    });
  }

  ngOnDestroy() {
    this._gestureController.enable(false);
    this._gestureController.destroy();
  }

  ngAfterViewInit() {
    new Spinner(_spinnerOptions).spin(this.spinner.nativeElement);
    // this.spinner.nativeElement.appendChild(this._spinner.el as HTMLElement);
  }

  onTouchStart(event: GestureDetail) {
    if (this.scrollValue) {
      return;
    }

    this.startY = event.currentY;
  }

  onTouchMove(event: GestureDetail) {
    this.currentY = event.currentY;

    if (this.scrollValue) {
      return;
    }

    this.change = event.currentY - this.startY - this.scrollValue;

    const _threhsold = this.thresholdPassed;

    const result = this._hasPassedThreshold();

    if (result && !_threhsold) {
      this.capacitorService.triggerHapticFeedback(
        this.capacitorService.impactStyles.Medium
      );
    }
  }

  onTouchEnd() {
    // Se l'utente ha trascinato verso il basso più della soglia, emetti l'evento di refresh
    if (this.thresholdPassed) {
      this.refresh.emit();
    }

    this.startY = 0;
    this.thresholdPassed = false;
    this.change = 0;
  }

  private _hasPassedThreshold(): boolean {
    const value = this.change > this.threshold;

    if (value) {
      this.thresholdPassed = true;
    }

    return value;
  }
}

const _spinnerOptions: SpinnerOptions = {
  lines: 8, // The number of lines to draw
  length: 16, // The length of each line
  width: 11, // The line thickness
  radius: 22, // The radius of the inner circle
  scale: 0.35, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1.2, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-shrink', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#ffffff', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  position: 'absolute', // Element positioning
};
