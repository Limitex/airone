/* tslint:disable */
/* eslint-disable */
/**
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
import {
  Entity,
  EntityFromJSON,
  EntityFromJSONTyped,
  EntityToJSON,
} from "./Entity";
import {
  UserBase,
  UserBaseFromJSON,
  UserBaseFromJSONTyped,
  UserBaseToJSON,
} from "./UserBase";

/**
 *
 * @export
 * @interface EntryBase
 */
export interface EntryBase {
  /**
   *
   * @type {number}
   * @memberof EntryBase
   */
  readonly id: number;
  /**
   *
   * @type {string}
   * @memberof EntryBase
   */
  readonly name: string;
  /**
   *
   * @type {Entity}
   * @memberof EntryBase
   */
  readonly schema: Entity | null;
  /**
   *
   * @type {boolean}
   * @memberof EntryBase
   */
  readonly isActive: boolean;
  /**
   *
   * @type {UserBase}
   * @memberof EntryBase
   */
  readonly deletedUser: UserBase | null;
  /**
   *
   * @type {Date}
   * @memberof EntryBase
   */
  deletedTime?: Date | null;
  /**
   *
   * @type {Date}
   * @memberof EntryBase
   */
  readonly updatedTime: Date;
}

export function EntryBaseFromJSON(json: any): EntryBase {
  return EntryBaseFromJSONTyped(json, false);
}

export function EntryBaseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EntryBase {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json["id"],
    name: json["name"],
    schema: EntityFromJSON(json["schema"]),
    isActive: json["is_active"],
    deletedUser: UserBaseFromJSON(json["deleted_user"]),
    deletedTime: !exists(json, "deleted_time")
      ? undefined
      : json["deleted_time"] === null
      ? null
      : new Date(json["deleted_time"]),
    updatedTime: new Date(json["updated_time"]),
  };
}

export function EntryBaseToJSON(value?: EntryBase | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    deleted_time:
      value.deletedTime === undefined
        ? undefined
        : value.deletedTime === null
        ? null
        : value.deletedTime.toISOString(),
  };
}
