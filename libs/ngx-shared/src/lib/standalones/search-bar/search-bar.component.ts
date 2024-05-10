import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  map,
  startWith,
  takeUntil,
} from 'rxjs';
import { UtilsService } from '../../services';

@Component({
  selector: 'notify-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [UtilsService],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Elemento da cercare...';
  @Input() helpLabel = 'Cerca';
  @Input() inputClass = 'input input-bordered w-full input-style';
  @Input({ required: true }) array$!: Observable<unknown[]>;
  @Input() filterableFields: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() filteredArray = new EventEmitter<any[]>();

  public inputControl = new FormControl();
  public destroy$ = new Subject<void>();

  constructor(private _utils: UtilsService) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    const input$ = this.inputControl.valueChanges.pipe(
      startWith(''),
      map((value) => value.toLowerCase().trim())
    );

    combineLatest([this.array$, input$])
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        map(([array, input]) => {
          if (!input) {
            return array;
          }

          return array.filter((item) => this._filterValues(item, input));
        })
      )
      .subscribe((array) => this.filteredArray.emit(array));
  }

  private _filterValues(item: unknown, input: string): boolean {
    return this.filterableFields.some((field) => {
      const foundValues = this._utils.deepSearchKey(
        item as { [key: string]: unknown },
        field
      );

      return foundValues.some((v) =>
        this._utils.normalizeValue(v).includes(input)
      );
    });
  }
}
