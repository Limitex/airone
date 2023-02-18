import { Box, Container, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Link, Prompt, useHistory } from "react-router-dom";

import { Group } from "../apiclient/autogenerated";
import { PageHeader } from "../components/common/PageHeader";
import { useTypedParams } from "../hooks/useTypedParams";
import { DjangoContext } from "../services/DjangoContext";
import { ForbiddenError } from "../services/Exceptions";

import { groupsPath, topPath } from "Routes";
import { aironeApiClientV2 } from "apiclient/AironeApiClientV2";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { SubmitButton } from "components/common/SubmitButton";
import { GroupForm } from "components/group/GroupForm";

export const EditGroupPage: FC = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { groupId } = useTypedParams<{ groupId?: number }>();

  const [group, _setGroup] = useState<Group>({
    id: 0,
    name: "",
    members: [],
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (groupId != null) {
        const _group = await aironeApiClientV2.getGroup(groupId);
        _setGroup(_group);
      }
    })();
  }, [groupId]);

  const submittable = useMemo((): boolean => {
    return group != null && group.name.length > 0;
  }, [group]);

  const setGroup = (group: Group) => {
    _setGroup(group);
    setEdited(true);
  };

  const handleSubmit = async () => {
    if (!submittable) return;
    if (group == null) return;

    if (groupId == null) {
      try {
        await aironeApiClientV2.createGroup({
          ...group,
          members: group.members.map((member) => member.id),
        });
        setSubmitted(true);
        enqueueSnackbar("グループの作成に成功しました", {
          variant: "success",
        });
        history.replace(groupsPath());
      } catch (e) {
        enqueueSnackbar("グループの作成に失敗しました", {
          variant: "error",
        });
      }
    } else {
      try {
        await aironeApiClientV2.updateGroup(groupId, {
          ...group,
          members: group.members.map((member) => member.id),
        });
        setSubmitted(true);
        enqueueSnackbar("グループの更新に成功しました", {
          variant: "success",
        });
        history.replace(groupsPath());
      } catch (e) {
        enqueueSnackbar("グループの更新に失敗しました", {
          variant: "error",
        });
      }
    }
  };

  const handleCancel = async () => {
    history.goBack();
  };

  if (DjangoContext.getInstance()?.user?.isSuperuser !== true) {
    throw new ForbiddenError("only admin can edit a group");
  }

  return (
    <Box>
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={groupsPath()}>
          グループ管理
        </Typography>
        <Typography color="textPrimary">グループ編集</Typography>
      </AironeBreadcrumbs>

      <PageHeader
        title={group.id != 0 ? group.name : "新規グループの作成"}
        description={group.id != 0 ? "グループ編集" : undefined}
      >
        <SubmitButton
          name="保存"
          disabled={!submittable}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </PageHeader>

      <Container>
        <GroupForm
          group={group}
          setGroup={setGroup}
          groupId={Number(groupId)}
        />
      </Container>

      <Prompt
        when={edited && !submitted}
        message="編集した内容は失われてしまいますが、このページを離れてもよろしいですか？"
      />
    </Box>
  );
};
