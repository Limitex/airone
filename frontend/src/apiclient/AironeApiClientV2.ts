import Cookies from "js-cookie";

import {
  ACL,
  AclApi,
  Attribute,
  Configuration,
  EntityDetail,
  EntityApi,
  EntryApi,
  EntryCreate,
  EntryRetrieve,
  EntryUpdate,
  EntryBase,
  EntryCopy,
  Group,
  GroupApi,
  PaginatedEntryBaseList,
  PaginatedEntityListList,
  EntityAttrCreate,
  EntityCreate,
  EntityUpdate,
  EntityApiV2ListRequest,
  Role,
  RoleApi,
  UserApi,
  UserRetrieve,
  Webhook,
  EntityAttrUpdate,
  PaginatedGetEntrySimpleList,
  GetEntryAttrReferral,
  PaginatedJobSerializersList,
  JobApi,
  JobSerializers,
  PaginatedUserListList,
  UserCreate,
  UserUpdate,
  UserToken,
  RoleCreateUpdate,
  GroupTree as _GroupTree,
  GroupCreateUpdate,
} from "apiclient/autogenerated";
import {
  EntityList as ConstEntityList,
  EntryReferralList,
  JobList,
} from "utils/Constants";

export type GroupTree = Pick<_GroupTree, "id" | "name"> & {
  children: Array<GroupTree>;
};

// Get CSRF Token from Cookie set by Django
// see https://docs.djangoproject.com/en/3.2/ref/csrf/
function getCsrfToken(): string {
  return Cookies.get("csrftoken");
}

/**
 * A rich API client with using auto-generated client with openapi-generator.
 */
class AironeApiClientV2 {
  private acl: AclApi;
  private entity: EntityApi;
  private entry: EntryApi;
  private group: GroupApi;
  private user: UserApi;
  private role: RoleApi;
  private job: JobApi;

  constructor() {
    const config = new Configuration({ basePath: "" });
    this.acl = new AclApi(config);
    this.entity = new EntityApi(config);
    this.entry = new EntryApi(config);
    // "GroupApi" is associated with "GroupAPI" (~/airone/group/api_v2/views.py)
    this.group = new GroupApi(config);
    this.user = new UserApi(config);
    this.role = new RoleApi(config);
    this.job = new JobApi(config);
  }

  async getAcl(id: number): Promise<ACL> {
    return this.acl.aclApiV2AclsRetrieve({ id });
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    isSuperuser: boolean
  ): Promise<UserCreate> {
    return await this.user.userApiV2Create(
      {
        userCreate: {
          username: username,
          email: email,
          password: password,
          isSuperuser: isSuperuser,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getUserToken(): Promise<UserToken> {
    return await this.user.userApiV2TokenRetrieve({
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "X-CSRFToken": getCsrfToken(),
      },
    });
  }

  async updateUserToken(): Promise<UserToken> {
    return await this.user.userApiV2TokenCreate(
      {},
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateUser(
    userId: number,
    username: string,
    email: string,
    isSuperuser: boolean
  ): Promise<UserUpdate> {
    return await this.user.userApiV2Update(
      {
        id: userId,
        userUpdate: {
          username,
          email,
          isSuperuser,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateAcl(
    id: number,
    name: string,
    objectType: number,
    isPublic: boolean,
    defaultPermission: number,
    acl: any[]
  ): Promise<void> {
    await this.acl.aclApiV2AclsUpdate(
      {
        id,
        aCL: {
          id: id,
          name: name,
          isPublic: isPublic,
          defaultPermission: defaultPermission,
          objtype: objectType,
          acl: acl,
          // readonly
          parent: undefined,
          acltypes: undefined,
          members: undefined,
          roles: undefined,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getEntities(
    page?: number,
    search?: string,
    isToplevel?: boolean
  ): Promise<PaginatedEntityListList> {
    const params: EntityApiV2ListRequest = page
      ? {
          offset: (page - 1) * ConstEntityList.MAX_ROW_COUNT,
          limit: ConstEntityList.MAX_ROW_COUNT,
          search: search,
          isToplevel: isToplevel,
        }
      : {
          // Any better way to get all the entities?
          limit: Number.MAX_SAFE_INTEGER,
          search: search,
          isToplevel: isToplevel,
        };

    return await this.entity.entityApiV2List(params);
  }

  async getEntity(id: number): Promise<EntityDetail> {
    return await this.entity.entityApiV2Retrieve({ id });
  }

  async createEntity(
    name: string,
    note: string,
    isToplevel: boolean,
    attrs: Array<EntityAttrCreate>,
    webhooks: Array<Webhook>
  ): Promise<EntityCreate> {
    return await this.entity.entityApiV2Create(
      {
        entityCreate: {
          id: undefined,
          name: name,
          note: note,
          isToplevel: isToplevel,
          attrs: attrs,
          webhooks: webhooks,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateEntity(
    id: number,
    name: string,
    note: string,
    isToplevel: boolean,
    attrs: Array<EntityAttrUpdate>,
    webhooks: Array<Webhook>
  ): Promise<EntityUpdate> {
    return await this.entity.entityApiV2Update(
      {
        id: id,
        entityUpdate: {
          id: undefined,
          name: name,
          note: note,
          isToplevel: isToplevel,
          attrs: attrs,
          webhooks: webhooks,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async deleteEntity(id: number): Promise<void> {
    return await this.entity.entityApiV2Destroy(
      { id },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getEntry(id: number): Promise<EntryRetrieve> {
    return await this.entry.entryApiV2Retrieve({ id });
  }

  async getEntryReferral(
    id: number,
    page: number,
    keyword?: string
  ): Promise<PaginatedGetEntrySimpleList> {
    return await this.entry.entryApiV2ReferralList({
      id: id,
      keyword: keyword,
      offset: (page - 1) * EntryReferralList.MAX_ROW_COUNT,
      limit: EntryReferralList.MAX_ROW_COUNT,
    });
  }

  async createEntry(
    entityId: number,
    name: string,
    attrs: Attribute[]
  ): Promise<EntryCreate> {
    return await this.entity.entityApiV2EntriesCreate(
      { entityId, entryCreate: { id: undefined, name, attrs } },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateEntry(
    id: number,
    name: string,
    attrs: Attribute[]
  ): Promise<EntryUpdate> {
    return await this.entry.entryApiV2Update(
      { id, entryUpdate: { id: undefined, name, attrs } },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async destroyEntry(id: number): Promise<void> {
    return await this.entry.entryApiV2Destroy(
      { id },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async restoreEntry(id: number): Promise<EntryBase> {
    return await this.entry.entryApiV2RestoreCreate(
      { id },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async copyEntry(
    id: number,
    copyEntryNames: Array<string>
  ): Promise<EntryCopy> {
    return await this.entry.entryApiV2CopyCreate(
      {
        id,
        entryCopy: {
          copyEntryNames: copyEntryNames,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getGroups(): Promise<Group[]> {
    return await this.group.groupApiV2GroupsList();
  }

  async getGroup(id: number): Promise<Group> {
    // groupApiV2GroupsRetrieve: associated with
    return await this.group.groupApiV2GroupsRetrieve({ id });
  }

  async createGroup(group: GroupCreateUpdate): Promise<void> {
    await this.group.groupApiV2GroupsCreate(
      { groupCreateUpdate: group },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateGroup(id: number, group: GroupCreateUpdate): Promise<void> {
    await this.group.groupApiV2GroupsUpdate(
      { id: id, groupCreateUpdate: group },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getGroupTrees(): Promise<GroupTree[]> {
    const groupTrees = await this.group.groupApiV2GroupsTreeList();

    // typing children here because API side type definition will break API client generation.
    const toTyped = (groupTree: { [key: string]: any }): GroupTree => ({
      id: groupTree["id"],
      name: groupTree["name"],
      children: groupTree["children"].map((child: { [key: string]: any }) =>
        toTyped(child)
      ),
    });

    return groupTrees.map((groupTree) => ({
      id: groupTree.id,
      name: groupTree.name,
      children: groupTree.children.map((child: { [key: string]: any }) =>
        toTyped(child)
      ),
    }));
  }

  async importGroups(formData: FormData): Promise<void> {
    return await this.group.groupApiV2GroupsImportCreate({
      headers: {
        "Content-Type": "application/yaml",
        "X-CSRFToken": getCsrfToken(),
      },
      body: formData,
    });
  }

  async getRoles(): Promise<Role[]> {
    return await this.role.roleApiV2List();
  }

  async getRole(roleId: number): Promise<Role> {
    return await this.role.roleApiV2Retrieve({ id: roleId });
  }

  async createRole(role: RoleCreateUpdate): Promise<void> {
    await this.role.roleApiV2Create(
      {
        roleCreateUpdate: role,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateRole(roleId: number, role: RoleCreateUpdate): Promise<void> {
    await this.role.roleApiV2Update(
      {
        id: roleId,
        roleCreateUpdate: role,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async deleteRole(roleId: number): Promise<void> {
    return await this.role.roleApiV2Destroy(
      {
        id: roleId,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getEntries(
    entityId: number,
    isActive = true,
    pageNumber = 1,
    keyword: string
  ): Promise<PaginatedEntryBaseList> {
    //return await this.entry.entryApiV2EntriesList(entityId, isActive, pageNumber);
    // ToDo: This method must pass "isActive" parameter by manupirating DRF API's declaration.
    return await this.entity.entityApiV2EntriesList({
      entityId,
      page: pageNumber,
      isActive: isActive,
      search: keyword,
      ordering: "name",
    });
  }

  async getSearchEntries(query: string): Promise<Array<EntryBase>> {
    return await this.entry.entryApiV2SearchList({
      query: query,
    });
  }

  async exportEntries(entityId: number, format: string): Promise<void> {
    await this.entry.entryApiV2ExportCreate(
      {
        entityId,
        entryExport: {
          format,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getEntryAttrReferrals(
    attrId: number,
    keyword?: string
  ): Promise<Array<GetEntryAttrReferral>> {
    return await this.entry.entryApiV2AttrReferralsList({
      attrId: attrId,
      keyword: keyword,
    });
  }

  // FIXME replace with auto-generated client code
  async advancedSearchEntries(
    entityIds: number[] = [],
    entryName = "",
    attrInfo: object[] = [],
    hasReferral = false,
    referralName = "",
    searchAllEntities = false,
    entryLimit = 100
  ): Promise<Response> {
    return fetch(`/entry/api/v2/advanced_search/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": getCsrfToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        entities: entityIds,
        entry_name: entryName,
        attrinfo: attrInfo,
        has_referral: hasReferral,
        is_all_entities: searchAllEntities,
        referral_name: referralName,
        entry_limit: entryLimit,
        is_output_all: false,
      }),
    });
  }

  async getUser(userId: number): Promise<UserRetrieve> {
    return await this.user.userApiV2Retrieve({
      id: userId,
    });
  }

  async destroyUser(id: number): Promise<void> {
    return await this.user.userApiV2Destroy(
      {
        id: id,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getUsers(page = 1, keyword?: string): Promise<PaginatedUserListList> {
    return await this.user.userApiV2List({
      page: page,
      search: keyword,
      ordering: "username",
    });
  }

  async getJobs(page = 1): Promise<PaginatedJobSerializersList> {
    return await this.job.jobApiV2JobsList({
      offset: (page - 1) * JobList.MAX_ROW_COUNT,
      limit: JobList.MAX_ROW_COUNT,
    });
  }

  async getRecentJobs(): Promise<Array<JobSerializers>> {
    // 'recent' means now - 1 hour
    const createdAfter = new Date();
    createdAfter.setHours(createdAfter.getHours() - 1);

    const resp = await this.job.jobApiV2JobsList({
      offset: 0,
      limit: JobList.MAX_ROW_COUNT,
      createdAfter: createdAfter,
    });
    return resp.results;
  }

  async importEntries(formData): Promise<void> {
    return await this.entry.entryApiV2ImportCreate({
      headers: {
        "Content-Type": "application/yaml",
        "X-CSRFToken": getCsrfToken(),
      },
      body: formData,
    });
  }
}

export const aironeApiClientV2 = new AironeApiClientV2();
