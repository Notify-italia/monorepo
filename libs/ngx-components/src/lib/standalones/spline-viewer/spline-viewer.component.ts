import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  afterNextRender,
} from '@angular/core';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'notify-spline-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spline-viewer.component.html',
  styleUrl: './spline-viewer.component.scss',
})
export class SplineViewerComponent {
  @ViewChild('3dCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() sceneId = '';

  @Output() ready = new EventEmitter<void>();

  constructor() {
    afterNextRender(() => {
      if (!this.sceneId) {
        return;
      }

      // Ridimensiona il canvas al caricamento
      this.resizeCanvas();

      const app = new Application(this.canvas.nativeElement, {
        renderMode: 'auto',
      });
      app.renderOnDemand = true;

      app.load(`https://prod.spline.design/${this.sceneId}/scene.splinecode`);
      app.addEventListener('rendered', () => {
        this.ready.emit();
      });
    });
  }

  private resizeCanvas() {
    this.canvas.nativeElement.addEventListener('resize', () => {
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;
    });
  }
}
