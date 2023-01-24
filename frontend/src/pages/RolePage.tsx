import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Container, Typography } from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { aironeApiClientV2 } from "../apiclient/AironeApiClientV2";
import { RoleImportModal } from "../components/role/RoleImportModal";
import { RoleList } from "../components/role/RoleList";

import { newRolePath, topPath } from "Routes";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { PageHeader } from "components/common/PageHeader";

export const RolePage: FC = () => {
  const [openImportModal, setOpenImportModal] = useState(false);

  const handleExport = useCallback(async () => {
    await aironeApiClientV2.exportRoles("role.yaml");
  }, []);

  return (
    <Box className="container-fluid">
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography color="textPrimary">ロール管理</Typography>
      </AironeBreadcrumbs>

      <PageHeader title="ロール管理">
        <Button
          variant="contained"
          color="info"
          sx={{ margin: "0 4px" }}
          onClick={handleExport}
        >
          エクスポート
        </Button>
        <Button
          variant="contained"
          color="info"
          sx={{ margin: "0 4px" }}
          onClick={() => setOpenImportModal(true)}
        >
          インポート
        </Button>
        <RoleImportModal
          openImportModal={openImportModal}
          closeImportModal={() => setOpenImportModal(false)}
        />
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to={newRolePath()}
          sx={{ height: "48px", borderRadius: "24px", ml: "16px" }}
        >
          <AddIcon /> 新規ロールを作成
        </Button>
      </PageHeader>

      <Container>
        <RoleList />
      </Container>
    </Box>
  );
};
