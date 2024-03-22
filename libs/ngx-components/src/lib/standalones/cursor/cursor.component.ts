import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'notify-cursor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.scss',
})
export class CursorComponent {
  private _currentScale = 1;
  private _defaultWidth = '22px';

  constructor() {}

  @ViewChild('Cursor') cursor: ElementRef | undefined;
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: PointerEvent) {
    if (!this.cursor) {
      return;
    }

    let cursorType = window.getComputedStyle(this.cursor.nativeElement).cursor;

    // If the cursor is 'auto', get the underlying cursor type
    if (cursorType === 'auto') {
      cursorType = this._getUnderlyingCursorType(event);
    }

    const _pxOffset = 10;

    this.cursor.nativeElement.animate(
      [
        {
          left: `${event.pageX - _pxOffset}px`,
          top: `${event.pageY - _pxOffset}px`,
        },
      ],
      {
        duration: 400,
        fill: 'forwards',
      }
    );

    switch (cursorType) {
      case 'pointer':
        this._pointerMouse(this.cursor.nativeElement);
        return;
      case 'text':
        this._pointerMouse(this.cursor.nativeElement);
        return;

      default:
        this._defaultMouse(this.cursor.nativeElement);
    }
  }

  @HostListener('document:click')
  onClick() {
    if (!this.cursor) {
      return;
    }

    this.cursor?.nativeElement.animate(
      [
        {
          scale: this._currentScale,
        },
        {
          border: `1px solid rgb(255, 255, 255)`,
          scale: this._currentScale * 2,
        },
        {
          scale: this._currentScale,
          width: this._defaultWidth,
        },
      ],
      {
        duration: 350,
        fill: 'both',
      }
    );
  }

  private _pointerMouse(cursor: HTMLElement) {
    this._currentScale = 3;

    // cursor.style.backdropFilter = 'blur(1px)';

    cursor.animate(
      [
        {
          scale: this._currentScale,
          border: '1px solid transparent',
          background: 'rgba(255, 255, 255, 0.2)',
          opacity: 1,
        },
      ],
      {
        duration: 300,
        fill: 'forwards',
      }
    );
  }

  // private _textMouse(cursor: HTMLElement) {
  //   cursor.style.backdropFilter = 'invert(100%)';

  //   cursor.animate(
  //     [
  //       {
  //         width: '5px',
  //         background: '#fff',

  //         'border-radius': '0%',
  //       },
  //     ],
  //     {
  //       duration: 300,
  //       fill: 'forwards',
  //     }
  //   );
  // }

  private _defaultMouse(cursor: HTMLElement) {
    cursor.animate(
      [
        {
          scale: 1,
          background: 'transparent',
          border: '1px solid #fff',
          opacity: 0.5,
          width: this._defaultWidth,
        },
      ],
      {
        duration: 300,
        fill: 'forwards',
      }
    );

    cursor.style.backdropFilter = 'invert(0)';
    this._currentScale = 1;
  }

  private _getUnderlyingCursorType(event: PointerEvent): string {
    const element = document.elementFromPoint(event.clientX, event.clientY);

    if (!element) {
      return 'default';
    }

    const selection = window.getSelection();

    if (selection && selection.type === 'Range') {
      return 'text';
    }

    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      return 'text';
    }

    const computedStyle = window.getComputedStyle(element);
    return computedStyle.cursor;
  }
}
