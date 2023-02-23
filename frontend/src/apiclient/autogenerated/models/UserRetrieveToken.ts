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
/**
 *
 * @export
 * @interface UserRetrieveToken
 */
export interface UserRetrieveToken {
  /**
   *
   * @type {string}
   * @memberof UserRetrieveToken
   */
  value: string;
  /**
   *
   * @type {number}
   * @memberof UserRetrieveToken
   */
  lifetime: number;
  /**
   *
   * @type {string}
   * @memberof UserRetrieveToken
   */
  expire: string;
  /**
   *
   * @type {string}
   * @memberof UserRetrieveToken
   */
  created: string;
}

export function UserRetrieveTokenFromJSON(json: any): UserRetrieveToken {
  return UserRetrieveTokenFromJSONTyped(json, false);
}

export function UserRetrieveTokenFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): UserRetrieveToken {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    value: json["value"],
    lifetime: json["lifetime"],
    expire: json["expire"],
    created: json["created"],
  };
}

export function UserRetrieveTokenToJSON(value?: UserRetrieveToken | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    value: value.value,
    lifetime: value.lifetime,
    expire: value.expire,
    created: value.created,
  };
}
