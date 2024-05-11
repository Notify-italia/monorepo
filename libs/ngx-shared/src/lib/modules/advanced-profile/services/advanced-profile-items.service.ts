import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { EnumNotifyAdvancedProfileItems } from '@notify/interfaces';
import mongoose from 'mongoose';

export interface INotifyAdvancedProfileManifest {
  type: EnumNotifyAdvancedProfileItems;
  formConstructor: {
    [key: string]: FormControl | FormArray | FormGroup;
  };
}

const advancedProfileManifests: {
  [key: string]: INotifyAdvancedProfileManifest;
} = {};

@Injectable()
export class AdvancedProfileItemsService {
  public static publishManifest(manifest: INotifyAdvancedProfileManifest) {
    advancedProfileManifests[manifest.type] = manifest;
  }

  public getManifest(manifest: EnumNotifyAdvancedProfileItems) {
    return (
      advancedProfileManifests[manifest] ||
      advancedProfileManifests[EnumNotifyAdvancedProfileItems.Unknown]
    );
  }

  public generateFormGroup(manifest: EnumNotifyAdvancedProfileItems) {
    const foundManifest = this.getManifest(manifest);
    const controls = foundManifest.formConstructor;
    const formGroup = new FormGroup(controls);

    formGroup.setControl('type', new FormControl(foundManifest.type));
    formGroup.setControl(
      '_id',
      new FormControl(new mongoose.Types.ObjectId().toHexString())
    );

    return formGroup;
  }
}
