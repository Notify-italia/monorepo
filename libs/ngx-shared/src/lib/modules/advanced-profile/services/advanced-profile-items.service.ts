import { Injectable, Type, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  EnumNotifyAdvancedProfileItems,
  INotifyProfile,
  ModifyDeep,
  NotifyAdvancedProfileItem,
  NotifyAdvancedProfileItemTypes,
} from '@notify/interfaces';
import mongoose from 'mongoose';
import { FormsService, controlsFromObject } from '../../../services';
import { INotifyTailwindDropzoneCdnConfig } from '../../tailwind-forms/components/tailwind-dropzone/tailwind-dropzone.component';

export interface INotifyAdvancedProfileManifest<
  T extends NotifyAdvancedProfileItem = NotifyAdvancedProfileItem
> {
  type: EnumNotifyAdvancedProfileItems;
  localizedName: string;
  filledIcon: string[];
  isSystemItem?: boolean;
  outlineIcon?: string[];
  formComponent?: Type<unknown>;
  playerComponent?: Type<unknown>;
  formOptions?: {
    hideTextSettings?: boolean;
    hideTitle?: boolean;
  };
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

  public dropzoneConfig(
    config: {
      item: string;
      profile: string;
    },
    apiUrl: string,
    headers: { [key: string]: string }
  ): INotifyTailwindDropzoneCdnConfig {
    const endpoint = `${apiUrl}/v1/profile/file`;
    return {
      postEndpoint: endpoint,
      authorization: headers,
      body: config,
      deleteEndpoint: endpoint,
      deleteSchema: {
        name: 'name',
      },
      deleteExtraParams: config,
      responseSchema: {
        value: 'url',
      },
    };
  }

  public static publishManifest(manifest: INotifyAdvancedProfileManifest) {
    manifest.definitions.type = manifest.type;
    advancedProfileManifests[manifest.type] = manifest;
  }

  public getSystemManifests(manifest: string) {
    return Object.values(advancedProfileManifests)
      .filter((m) => m.isSystemItem)
      .filter((m) => m.localizedName.includes(manifest))[0];
  }

  public getManifest(manifest: NotifyAdvancedProfileItemTypes) {
    const result =
      advancedProfileManifests[manifest] ||
      advancedProfileManifests[EnumNotifyAdvancedProfileItems.Unknown];

    if (result.isSystemItem) {
      return advancedProfileManifests[EnumNotifyAdvancedProfileItems.Unknown];
    }

    return result;
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
