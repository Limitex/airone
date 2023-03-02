import { z } from "zod";

import { ACL } from "../../apiclient/autogenerated";
import { schemaForType } from "../../services/ZodSchemaUtil";

/*
  "name":"20220202"
  "is_public":false,
  "default_permission":8,
  "objtype":4,
  "acl":,
  "parent":null}
*/

type ACLForm = Pick<ACL, "isPublic" | "defaultPermission" | "objtype" | "acl">;

export const schema = schemaForType<ACLForm>()(
  z.object({
    isPublic: z.boolean().optional().default(true),
    defaultPermission: z.number().optional(),
    objtype: z.number().optional(),
    acl: z.array(
      z.object({
        member_id: z.number(),
        value: z.number(),
      })
    ),
  })
);

export type Schema = z.infer<typeof schema>;
