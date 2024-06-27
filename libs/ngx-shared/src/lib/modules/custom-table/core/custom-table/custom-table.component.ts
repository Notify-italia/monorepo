import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnknownType } from '@notify/interfaces';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import {
  LoadingComponent,
  NoItemsComponent,
  SearchBarComponent,
} from '../../../../standalones';
import {
  CustomTableActionsComponent,
  ICTActionsValue,
} from '../parts/ct-actions-value.part.component';
import {
  CustomTableAvatarValueComponent,
  ICTAvatarValue,
} from '../parts/ct-avatar-value.part.component';
import {
  CustomTableBadgeValueComponent,
  ICTBadgevalue,
} from '../parts/ct-badge-value.part.component';
import {
  CustomTableFieldValueComponent,
  ICTFieldValue,
} from '../parts/ct-field-value.part.component';
import { CustomTableHeaderComponent } from '../parts/ct-header.part.component';
import { CustomTableSkeletonComponent } from '../parts/ct-skeleton.part.component';
import {
  CustomTableSorterComponent,
  INotifyCustomTableSorter,
} from '../parts/ct-sorter.part.component';

export interface INotifyCustomTableConfig {
  columns: INotifyCustomTableColumn[];
  searchBar: {
    filterableFields: string[];
    helpLabel?: string;
    placeholder?: string;
    debounceTime?: number;
  };
  clickableRows?: boolean;
  skeletonRows: number;
  defaultSorter?: string;
  style?: {
    transparentBackground?: boolean;
    alternateRows?: boolean;
  };
}

interface INotifyCustomTableColumn {
  id: string;
  label: string;
  hidden: (item: INotifyCustomTableColumn, iterate?: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sorter?: INotifyCustomTableSorter;
  value: ICTFieldValue | ICTBadgevalue | ICTAvatarValue | ICTActionsValue;
}

@Component({
  selector: 'notify-custom-table',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    NoItemsComponent,
    CustomTableFieldValueComponent,
    CustomTableBadgeValueComponent,
    CustomTableAvatarValueComponent,
    CustomTableSkeletonComponent,
    CustomTableActionsComponent,
    CustomTableSorterComponent,
    CustomTableHeaderComponent,
    LoadingComponent,
  ],
  templateUrl: './custom-table.component.html',
})
export class CustomTableComponent implements OnInit {
  @Input({ required: true }) public config!: INotifyCustomTableConfig;
  @Input() iterable$ = new Observable<unknown[]>();
  @Input() public noItemsMessages = {
    title: 'Nessun Elemento',
    subtitle: 'Non ci sono elementi da mostrare',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() public rowClick = new EventEmitter<any>();
  @Output() public actionClicked = new EventEmitter<{
    event: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  }>();

  public computedIterable$ = new Observable<UnknownType[] | null>();
  public sorter$ = new BehaviorSubject<INotifyCustomTableSorter>(() => 0);
  public filteredIterable$ = new BehaviorSubject<UnknownType[] | null>(null);

  public get iterableSkeletonRows(): number[] {
    return Array.from({ length: this.config.skeletonRows ?? 0 });
  }

  public ngOnInit(): void {
    this.computedIterable$ = combineLatest([
      this.sorter$,
      this.filteredIterable$,
    ]).pipe(
      map(([s, i]) => {
        if (!s || !i) {
          return i;
        }

        return i?.sort(s);
      })
    );
  }

  public handleRowClick(iterate: UnknownType) {
    this.rowClick.emit(iterate);
  }

  public handleActionClick(
    action: ICTActionsValue['actions'][0],
    iterate: UnknownType
  ) {
    this.actionClicked.emit({
      event: action.eventName,
      data: iterate,
    });
  }

  public handleFilteredArray(e: UnknownType[]) {
    this.filteredIterable$.next(e);
  }
}
