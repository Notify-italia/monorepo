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
import { UtilsService } from '@notify/nfc-app-services';
import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  map,
  startWith,
  takeUntil,
} from 'rxjs';

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
  @Input() helpLabel = 'Cerca...';
  @Input() inputClass = 'input input-bordered w-full pl-14 input-style';
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
      map((value) => value.toLowerCase())
    );

    combineLatest([this.array$, input$])
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        map(([array, input]) => {
          if (!input) {
            return array;
          }

          return array.filter((item) =>
            this.filterableFields.some((field) =>
              this._utils
                .deepFindFields(item as { [key: string]: unknown }, field)
                ?.toString()
                .toLowerCase()
                .includes(input)
            )
          );
        })
      )
      .subscribe((array) => {
        console.log(array);
        this.filteredArray.emit(array);
      });
  }
}
