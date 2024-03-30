import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  map,
  startWith,
} from 'rxjs';
import { TailwindFormsModule } from '../../modules/tailwind-forms/tailwind-forms.module';
import { SvgBoxIcon, SvgboxService } from '../../services';
import { SvgBoxIconComponent } from '../svg-box-icon/svg-box-icon.component';

@Component({
  selector: 'notify-icon-selector',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    SvgBoxIconComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './icon-selector.component.html',
  styleUrls: ['./icon-selector.component.scss'],
})
export class IconSelectorComponent implements OnInit {
  @Input() public icon?: SvgBoxIcon['name'];
  @Output() public iconValue = new EventEmitter<SvgBoxIcon | null>();

  @ViewChildren('card') public cards?: QueryList<ElementRef>;

  public hideSelector = false;
  public MANUAL_REFRESH = true;

  public searchValue = new FormControl('');
  public availableIcons$ = new BehaviorSubject<SvgBoxIcon[]>(
    this._svgBox.availableIcons
  );
  public filteredIcons$ = new Observable<SvgBoxIcon[]>();

  public currentIcon: SvgBoxIcon = DEFAULT_ICON;

  constructor(private _svgBox: SvgboxService) {
    this._searchFilter();
  }

  public ngOnInit() {
    if (this.icon) {
      //if the icon is passed as input, we hide the selector and set the current icon

      this.currentIcon = this.availableIcons$.value.find(
        (icon) => icon.name === this.icon
      ) as SvgBoxIcon;
      this.closeSelector();
    }

    this.iconValue.emit(this.currentIcon);
  }

  public onMouseMove(event: MouseEvent) {
    this.cards?.forEach((card) => {
      const rect = card.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.nativeElement.style.setProperty('--xPos', `${x}px`);
      card.nativeElement.style.setProperty('--yPos', `${y}px`);
    });
  }

  public setIcon(icon: SvgBoxIcon) {
    this.currentIcon = icon;

    this.closeSelector();

    this._refresh();
  }

  public closeSelector() {
    this.hideSelector = true;

    this.iconValue.emit(
      this.currentIcon === DEFAULT_ICON ? null : this.currentIcon
    );
  }

  private _refresh() {
    this.MANUAL_REFRESH = false;

    setTimeout(() => {
      this.MANUAL_REFRESH = true;
    }, 1);
  }

  @HostListener('document:keydown.escape')
  private _closeSelectorOnEscape() {
    this.closeSelector();
  }

  private _searchFilter() {
    const searchValue$ = this.searchValue.valueChanges.pipe(
      debounceTime(500),
      startWith('')
    );

    this.filteredIcons$ = combineLatest([
      this.availableIcons$,
      searchValue$,
    ]).pipe(
      map(([icons, searchValue]) => {
        if (!searchValue || searchValue?.length < 3) {
          return icons;
        }

        return icons.filter((icon) => {
          return [icon.name, icon.expanded]
            .join(' ')
            .toLowerCase()
            .includes(searchValue?.toLowerCase());
        });
      })
    );
  }
}

const DEFAULT_ICON = {
  expanded: 'Ignoto',
  name: 'question',
  tags: [],
  set: 'octicons',
  score: 10,
};
