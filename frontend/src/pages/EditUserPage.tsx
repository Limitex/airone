import { Box, Typography, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Link, Prompt } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { aironeApiClientV2 } from "../apiclient/AironeApiClientV2";
import { useAsyncWithThrow } from "../hooks/useAsyncWithThrow";
import { useTypedParams } from "../hooks/useTypedParams";

import { topPath, usersPath } from "Routes";
import { UserRetrieve } from "apiclient/autogenerated";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { Loading } from "components/common/Loading";
import { PageHeader } from "components/common/PageHeader";
import { UserForm } from "components/user/UserForm";
import { DjangoContext } from "utils/DjangoContext";

export interface AironeUserProps extends UserRetrieve {
  password?: string;
}

export const EditUserPage: FC = () => {
  const { userId } = useTypedParams<{ userId: number }>();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const user = useAsyncWithThrow(async () => {
    if (userId) {
      return await aironeApiClientV2.getUser(userId);
    }
  }, [userId]);

  const djangoContext = DjangoContext.getInstance();

  const [userInfo, _setUserInfo] = useState<AironeUserProps>({
    id: 0,
    username: "",
    password: "",
    email: "",
    isSuperuser: false,
    dateJoined: "",
    token: {
      value: "",
      lifetime: 86400,
      expire: "",
      created: "",
    },
    authenticateType: djangoContext.userAuthenticateType.local,
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);

  useEffect(() => {
    if (!user.loading && user.value !== undefined) {
      setUserInfo(user.value);
    }
  }, [user]);

  const isCreateMode = useMemo(() => {
    return user.value?.id == null;
  }, [user.value]);

  const setUserInfo = (userInfo: AironeUserProps) => {
    setEdited(true);
    _setUserInfo(userInfo);
  };

  const handleSubmit = () => {
    if (isCreateMode) {
      aironeApiClientV2
        .createUser(
          userInfo.username,
          userInfo.email,
          userInfo.password,
          userInfo.isSuperuser
        )
        .then(() => {
          setSubmitted(true);
          enqueueSnackbar("ユーザの作成に成功しました", {
            variant: "success",
          });
          history.push(usersPath());
        })
        .catch((err) => {
          const json = err.json();
          const reasons = json["name"];
          enqueueSnackbar(`ユーザの作成に失敗しました。詳細: ${reasons}`, {
            variant: "error",
          });
        });
    } else {
      aironeApiClientV2
        .updateUser(
          userInfo.id,
          userInfo.username,
          userInfo.email,
          userInfo.isSuperuser
        )
        .then(() => {
          setSubmitted(true);
          enqueueSnackbar("ユーザの更新に成功しました", {
            variant: "success",
          });
          history.push(usersPath());
        })
        .catch((err) => {
          const json = err.json();
          const reasons = json["name"];
          enqueueSnackbar(`ユーザの更新に失敗しました。詳細: ${reasons}`, {
            variant: "error",
          });
        });
    }
  };

  const handleCancel = () => {
    history.replace(usersPath());
  };

  const handleRefreshToken = () => {
    aironeApiClientV2
      .updateUserToken()
      .then((val) => {
        setUserInfo({
          ...userInfo,
          token: {
            ...userInfo.token,
            value: val.key,
          },
        });
      })
      .catch((err) => {
        const json = err.json();
        const reason = json["code"];
        enqueueSnackbar(`Token の更新に失敗しました。詳細: ${reason}`, {
          variant: "error",
        });
      });
  };

  return (
    <Box>
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={usersPath()}>
          ユーザ管理
        </Typography>
        <Typography color="textPrimary">ユーザ情報の設定</Typography>
      </AironeBreadcrumbs>
      <PageHeader
        title={"ユーザ情報の設定"}
        subTitle={""}
        componentSubmits={
          <Box display="flex" justifyContent="center">
            <Box mx="4px">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
              >
                保存
              </Button>
            </Box>
            <Box mx="4px">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleRefreshToken}
              >
                Token を更新
              </Button>
            </Box>
            <Box mx="4px">
              <Button variant="outlined" color="primary" onClick={handleCancel}>
                キャンセル
              </Button>
            </Box>
          </Box>
        }
      />

      {user.loading ? (
        <Loading />
      ) : (
        <UserForm userInfo={userInfo} setUserInfo={setUserInfo} />
      )}

      <Prompt
        when={edited && !submitted}
        message="編集した内容は失われてしまいますが、このページを離れてもよろしいですか？"
      />
    </Box>
  );
};
