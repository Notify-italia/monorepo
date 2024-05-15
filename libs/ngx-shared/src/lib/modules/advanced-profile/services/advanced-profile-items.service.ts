import { Injectable, Type, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModifyDeep } from '@notify/api-shared';
import {
  EnumNotifyAdvancedProfileItems,
  INotifyProfile,
  NotifyAdvancedProfileItem,
  NotifyAdvancedProfileItemTypes,
} from '@notify/interfaces';
import mongoose from 'mongoose';
import { FormsService, controlsFromObject } from '../../../services';

export interface INotifyAdvancedProfileManifest<
  T extends NotifyAdvancedProfileItem = NotifyAdvancedProfileItem
> {
  type: EnumNotifyAdvancedProfileItems;
  localizedName: string;
  filledIcon: string[];
  outlineIcon?: string[];
  formComponent?: Type<unknown>;
  definitions: ModifyDeep<
    T,
    {
      type: EnumNotifyAdvancedProfileItems | undefined;
    }
  >;
}

export type advancedProfileForm = FormGroup<
  controlsFromObject<INotifyProfile['advancedProfile']>
>;

const advancedProfileManifests: {
  [key: string]: INotifyAdvancedProfileManifest;
} = {};

@Injectable()
export class AdvancedProfileItemsService {
  private formsSerivce = inject(FormsService);

  public static publishManifest(manifest: INotifyAdvancedProfileManifest) {
    manifest.definitions.type = manifest.type;
    advancedProfileManifests[manifest.type] = manifest;
  }

  public getManifest(manifest: NotifyAdvancedProfileItemTypes) {
    return (
      advancedProfileManifests[manifest] ||
      advancedProfileManifests[EnumNotifyAdvancedProfileItems.Unknown]
    );
  }

  public getAvailableItems() {
    return Object.keys(advancedProfileManifests)
      .map((key) => advancedProfileManifests[key].type)
      .map((item) => ({
        label: advancedProfileManifests[item].localizedName,
        type: item,
        icon: advancedProfileManifests[item].filledIcon,
      }))
      .filter((item) => item.type !== EnumNotifyAdvancedProfileItems.Unknown);
  }

  public generateFormGroup(manifest: NotifyAdvancedProfileItemTypes) {
    const foundManifest = this.getManifest(manifest);
    const controls = foundManifest.definitions;
    const formGroup = this.formsSerivce.createFormGroup(controls) as FormGroup;

    formGroup.setControl(
      '_id',
      new FormControl(new mongoose.Types.ObjectId().toHexString())
    );

    return formGroup;
  }

  public createSelectOptions(
    enumerator: Record<string, string>,
    dictionary: Record<string, string> = {}
  ) {
    return Object.values(enumerator).map((value) => ({
      name: dictionary[value] || value,
      value: value,
    }));
  }
}
