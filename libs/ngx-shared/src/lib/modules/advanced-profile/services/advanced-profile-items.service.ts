import { Injectable, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import mongoose from 'mongoose';
import { FormsService } from '../../../services';

export interface INotifyAdvancedProfileManifest {
  type: EnumNotifyAdvancedProfileItems;
  localizedName: string;
  filledIcon: string[];
  outlineIcon?: string[];
  definitions: {
    [key: string]: unknown; //{key: deafult value}
  };
}

const advancedProfileManifests: {
  [key: string]: INotifyAdvancedProfileManifest;
} = {};

@Injectable()
export class AdvancedProfileItemsService {
  private formsSerivce = inject(FormsService);

  public static publishManifest(manifest: INotifyAdvancedProfileManifest) {
    advancedProfileManifests[manifest.type] = manifest;
  }

  public getManifest(manifest: EnumNotifyAdvancedProfileItems) {
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

  public generateFormGroup(manifest: EnumNotifyAdvancedProfileItems) {
    const foundManifest = this.getManifest(manifest);
    const controls = foundManifest.definitions;
    const formGroup = this.formsSerivce.createFormGroup(controls);

    formGroup.setControl('type', new FormControl(foundManifest.type));
    formGroup.setControl(
      '_id',
      new FormControl(new mongoose.Types.ObjectId().toHexString())
    );

    return formGroup;
  }
}
