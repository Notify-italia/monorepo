import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnknownObject } from '@notify/interfaces';
import { BehaviorSubject, Observable, Subject, combineLatest, map } from 'rxjs';
import { NoItemsComponent, SearchBarComponent } from '../../../../standalones';
import {
  CustomTableActionsComponent,
  ICTActionsvalue,
} from '../extensions/custom-table-actions-value.component';
import {
  CustomTableAvatarValueComponent,
  ICTAvatarvalue,
} from '../extensions/custom-table-avatar-value.component';
import {
  CustomTableBadgeValueComponent,
  ICTBadgevalue,
} from '../extensions/custom-table-badge-value.component';
import {
  CustomTableFieldValueComponent,
  ICTFieldValue,
} from '../extensions/custom-table-field-value.component';
import { CustomTableSkeletonComponent } from '../extensions/custom-table-skeleton.component';
import {
  CustomTableSorterComponent,
  INotifyCustomTableSorter,
} from '../extensions/custom-table-sorter.component';

export interface INotifyCustomTableConfig {
  filterableFields: string[];
  columns: INotifyCustomTableColumn[];
  clickableRows?: boolean;
  skeletonRows: number;
  style?: {
    transparentBackground?: boolean;
    alternateRows?: boolean;
  };
}

interface INotifyCustomTableColumn {
  id: string;
  label: string;
  hidden?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sorter?: INotifyCustomTableSorter;
  value: ICTFieldValue | ICTBadgevalue | ICTAvatarvalue | ICTActionsvalue;
}

@Component({
  selector: 'notify-custom-table-core',
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
  ],
  templateUrl: './custom-table-core.component.html',
})
export class CustomTableCoreComponent implements OnInit {
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

  public computedIterable$ = new Observable<UnknownObject[] | null>();
  public sorter$ = new BehaviorSubject<INotifyCustomTableSorter>(() => 0);
  public filteredIterable$ = new BehaviorSubject<UnknownObject[] | null>(null);

  public activeSorter = new Subject<string>();

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

  public handleRowClick(iterate: UnknownObject) {
    this.rowClick.emit(iterate);
  }

  public handleActionClick(
    action: ICTActionsvalue['actions'][0],
    iterate: UnknownObject
  ) {
    this.actionClicked.emit({
      event: action.eventName,
      data: iterate,
    });
  }

  public handleFilteredArray(e: UnknownObject[]) {
    this.filteredIterable$.next(e);
  }
}
