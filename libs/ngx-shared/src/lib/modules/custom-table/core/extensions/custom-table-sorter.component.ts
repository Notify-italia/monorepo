import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnknownObject } from '@notify/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { UtilsService } from '../../../../services';
import { AvatarComponent } from '../../../../standalones';

export type INotifyCustomTableSorter =
  | ((a: UnknownObject, b: UnknownObject) => number)
  | null;

@Component({
  standalone: true,
  selector: 'notify-custom-table-sorter',
  imports: [CommonModule, AvatarComponent],
  providers: [UtilsService],
  styles: `
  svg {
    @apply h-4 w-4;
  }
  `,
  template: `
    <button class="flex items-center" *ngIf="sorter" (click)="toggleSort()">
      @switch (currentSort) { @case ('none') {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
        />
      </svg>

      } @case ('asc') {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
        />
      </svg>
      } @case ('desc') {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
        />
      </svg>

      } }
    </button>
  `,
})
export class CustomTableSorterComponent implements OnInit {
  @Input() public column = '';
  @Input() public iterable: UnknownObject[] = [];
  @Input() public sorter?: INotifyCustomTableSorter;
  @Input() resetSort = new Subject<string>();
  @Input() componentDestroyed = new Subject<void>();

  @Output() public sortChange = new EventEmitter<INotifyCustomTableSorter>();

  public currentSort: 'none' | 'asc' | 'desc' = 'none';

  public ngOnInit(): void {
    this.resetSort.pipe(takeUntil(this.componentDestroyed)).subscribe((v) => {
      if (v === this.column) {
        return;
      }

      this.currentSort = 'none';
    });
  }

  public toggleSort(): void {
    switch (this.currentSort) {
      case 'none':
        this.currentSort = 'asc';
        break;
      case 'asc':
        this.currentSort = 'desc';
        break;
      case 'desc':
        this.currentSort = 'asc';
        break;
    }

    this._sort();
  }

  private _sort(): void {
    if (!this.sorter) {
      return;
    }

    if (this.currentSort === 'none') {
      this.sortChange.emit(null);
      return;
    }

    if (this.currentSort === 'asc') {
      this.sortChange.emit(this.sorter);
      return;
    }

    if (this.currentSort === 'desc') {
      //assegno il valore di sorter a sorter così da poterlo invertire e passare alla funzione sortChange
      const sorter = this.sorter;
      this.sortChange.emit((a: UnknownObject, b: UnknownObject) =>
        sorter(b, a)
      );
      return;
    }
  }
}
