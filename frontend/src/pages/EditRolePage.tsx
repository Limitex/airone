import { Box, Container, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState } from "react";
import { Link, Prompt, useHistory } from "react-router-dom";

import { Role, RoleCreateUpdate } from "../apiclient/autogenerated";
import { PageHeader } from "../components/common/PageHeader";
import { RoleForm } from "../components/role/RoleForm";
import { useTypedParams } from "../hooks/useTypedParams";

import { topPath, rolesPath } from "Routes";
import { aironeApiClientV2 } from "apiclient/AironeApiClientV2";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { SubmitButton } from "components/common/SubmitButton";

export const EditRolePage: FC = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { roleId } = useTypedParams<{ roleId?: number }>();

  const [role, _setRole] = useState<Role>({
    id: 0,
    isActive: true,
    name: "",
    description: "",
    users: [],
    groups: [],
    adminUsers: [],
    adminGroups: [],
  });
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const _role =
        roleId != null ? await aironeApiClientV2.getRole(roleId) : null;
      if (_role != null) {
        _setRole(_role);
      }
    })();
  }, [roleId]);

  const setRole = (role: Role) => {
    setEdited(true);
    _setRole(role);
  };

  const handleSubmit = async () => {
    if (!submittable) return;
    if (role == null) return;

    const roleCreateUpdate: RoleCreateUpdate = {
      ...role,
      users: role.users.map((user) => user.id),
      groups: role.groups.map((group) => group.id),
      adminUsers: role.adminUsers.map((user) => user.id),
      adminGroups: role.adminGroups.map((group) => group.id),
    };

    if (roleId == null) {
      try {
        await aironeApiClientV2.createRole(roleCreateUpdate);
        setSubmitted(true);
        enqueueSnackbar("ロールの作成に成功しました", {
          variant: "success",
        });
        history.push(rolesPath());
      } catch (e) {
        enqueueSnackbar(`ロールの作成に失敗しました。`, {
          variant: "error",
        });
      }
    } else {
      try {
        await aironeApiClientV2.updateRole(roleId, roleCreateUpdate);
        setSubmitted(true);
        enqueueSnackbar("ロールの更新に成功しました", {
          variant: "success",
        });
        history.push(rolesPath());
      } catch (e) {
        enqueueSnackbar(`ロールの更新に失敗しました。`, {
          variant: "error",
        });
      }
    }
  };

  const handleCancel = async () => {
    history.goBack();
  };

  return (
    <Box className="container-fluid">
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={rolesPath()}>
          ロール管理
        </Typography>
        <Typography color="textPrimary">ロール編集</Typography>
      </AironeBreadcrumbs>

      <PageHeader
        title={role.id != 0 ? role.name : "新規ロールの作成"}
        description={role.id != 0 ? "ロール編集" : undefined}
      >
        <SubmitButton
          name="保存"
          disabled={!submittable}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </PageHeader>

      <Container>
        <RoleForm
          role={role}
          setRole={setRole}
          setSubmittable={setSubmittable}
        />
      </Container>

      <Prompt
        when={edited && !submitted}
        message="編集した内容は失われてしまいますが、このページを離れてもよろしいですか？"
      />
    </Box>
  );
};
