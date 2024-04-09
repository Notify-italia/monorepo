import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { INotifyCustomTableValueBase } from '../../../../constructors/custom-table-value.base.component';
import { NoItemsComponent, SearchBarComponent } from '../../../../standalones';
import {
  CustomTableAvatarValueComponent,
  ICTAvatarvalue,
} from '../widgets/custom-table-avatar-value.component';
import {
  CustomTableBadgeValueComponent,
  ICTBadgevalue,
} from '../widgets/custom-table-badge-value.component';
import {
  CustomTableFieldValueComponent,
  ICTFieldvalue,
} from '../widgets/custom-table-field-value.component';
import { CustomTableSkeletonComponent } from '../widgets/custom-table-skeleton.component';

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
  value: ICTFieldvalue | ICTBadgevalue | ICTAvatarvalue | ICTActionsvalue;
}

interface ICTActionsvalue extends INotifyCustomTableValueBase {
  valueType: 'actions';
  actions: {
    eventName: string;
    icon: string[];
    color: string;
  }[];
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
  ],
  templateUrl: './custom-table-core.component.html',
  styleUrl: './custom-table-core.component.scss',
})
export class CustomTableCoreComponent {
  @Input({ required: true }) public config!: INotifyCustomTableConfig;
  @Input() iterable$ = new Observable<unknown[]>();
  @Input() public noItemsMessages = {
    title: 'Nessun Elemento',
    subtitle: 'Non ci sono elementi da mostrare',
  };

  @Output() public rowClick = new EventEmitter<Record<string, unknown>>();

  public filteredIterable: Record<string, unknown>[] | null = null;

  public handleRowClick(iterate: Record<string, unknown>) {
    this.rowClick.emit(iterate);
  }

  public get iterableSkeletonRows(): number[] {
    return Array.from({ length: this.config.skeletonRows ?? 0 });
  }
}
