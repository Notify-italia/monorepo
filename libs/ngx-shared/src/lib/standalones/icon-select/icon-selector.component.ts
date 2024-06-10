import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
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
export class IconSelectorComponent implements OnInit, OnChanges {
  @ViewChildren('card') public cards?: QueryList<ElementRef>;

  @Input() public icon?: SvgBoxIcon['name'];
  @Input() public iconSet?: SvgBoxIcon[];
  @Input() public openSelectorOnBoot = true;
  @Input() public title = 'Servizio';
  @Input() public showIconLabel = true;
  @Input() public iconLabelPosition: 'bottom' | 'right' = 'bottom';

  @Output() public iconValue = new EventEmitter<SvgBoxIcon | null>();
  @Output() public iconChange = new EventEmitter<{
    current: SvgBoxIcon | null;
    new: SvgBoxIcon | null;
  }>();

  public hideSelector = false;
  public MANUAL_REFRESH = true;

  public searchValue = new FormControl('');
  public availableIcons$ = new BehaviorSubject<SvgBoxIcon[]>(
    this._svgBox.availableIcons
  );
  public filteredIcons$ = new Observable<SvgBoxIcon[]>();

  public currentIcon: SvgBoxIcon = DEFAULT_ICON;

  private get iconInSet() {
    const icon = this.availableIcons$.value.find(
      (icon) => icon.name === this.icon
    ) as SvgBoxIcon;

    return icon;
  }

  constructor(private _svgBox: SvgboxService) {
    this._searchFilter();
  }

  public ngOnInit() {
    if (this.iconSet?.length) {
      this.availableIcons$.next(this.iconSet);
    }

    if (this.icon || !this.openSelectorOnBoot) {
      this.currentIcon =
        this.iconInSet || (this.openSelectorOnBoot ? null : DEFAULT_ICON);
      this.closeSelector();
    }

    this.iconValue.emit(this.currentIcon);
  }

  public ngOnChanges() {
    this.currentIcon = this.iconInSet || DEFAULT_ICON;
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
    this.iconChange.emit({ current: this.currentIcon, new: icon });
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
