import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { INotifyCustomTableValueBase } from '../../../../constructors/custom-table-value.base.component';
import { NoItemsComponent, SearchBarComponent } from '../../../../standalones';
import {
  CustomTableBadgeValueComponent,
  ICTBadgevalue,
} from '../custom-table-badge-value/custom-table-badge-value.component';
import {
  CustomTableFieldValueComponent,
  ICTFieldvalue,
} from '../custom-table-field-value/custom-table-field-value.component';

export interface INotifyCustomTableConfig {
  filterableFields: string[];
  columns: INotifyCustomTableColumn[];
  skeletonRows: number;
  style?: {
    transparentBackground?: boolean;
  };
}

interface INotifyCustomTableColumn {
  id: string;
  label: string;
  hidden?: boolean;
  value: ICTFieldvalue | ICTBadgevalue | ICTAvatarvalue | ICTActionsvalue;
}

interface ICTAvatarvalue extends INotifyCustomTableValueBase {
  valueType: 'avatar';
  avatarSize: string;
  fields: {
    src: string;
    mask: string;
    backgroundColor: string;
    placeholderSeed: string;
  };
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

  public filteredIterable: Record<string, unknown>[] = [];
  public get iterableSkeletonRows(): number[] {
    return Array.from({ length: this.config?.skeletonRows ?? 0 });
  }
}
