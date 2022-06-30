import {
  Button,
  Box,
  Checkbox,
  Grid,
  Input,
  List,
  ListItem,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { FC, useMemo, useState } from "react";
import { useAsync } from "react-use";

import { aironeApiClientV2 } from "../../../apiclient/AironeApiClientV2";
import {
  EntryRetrieveValueAsObject,
  EntryRetrieveValueAsObjectSchema,
} from "../../../apiclient/autogenerated";
import { getAttrReferrals } from "../../../utils/AironeAPIClient";
// import { AutoCompletedField } from "../../common/AutoCompletedField";

import { EditableEntryAttrs } from "./EditableEntry";

import { DjangoContext } from "utils/DjangoContext";

interface CommonProps {
  attrName: string;
  attrType: number;
  index?: number;
  handleChange: (attrName: string, attrType: number, valueInfo: any) => void;
}

const AirOneReferralBox: FC<any> = ({
  multiple,
  options,
  defaultValue,
  onChange,
  onInputChange,
  onKeyPress,
  keyword,
}) => {
  console.log("keyword", keyword);

  return (
    <Autocomplete
      sx={{ width: "50%" }}
      multiple={multiple}
      options={options}
      getOptionLabel={(option) => option.name}
      defaultValue={defaultValue}
      onChange={onChange}
      onInputChange={onInputChange}
      onKeyPress={onKeyPress}
      renderInput={(params) => (
        <TextField
          //{console.log(params.inputProps)}
          // {console.log('[onix/AirOneReferralBox(10)]', params)}
          {...params}
          variant="standard"
          label="Multiple values"
          placeholder="Favorites"
          // inputProps={{ defaultValue: keyword }}
          inputProps={{...params.inputProps, value: keyword}}
          // autoFocus={keyword}
        />
      )}
    />
  );
};

const ElemString: FC<
  CommonProps & {
    attrValue: string;
    handleClickDeleteListItem: (attrName: string, index?: number) => void;
  }
> = ({
  attrName,
  attrValue,
  attrType,
  index,
  handleChange,
  handleClickDeleteListItem,
}) => {
  return (
    <Box display="flex">
      <Input
        type="text"
        value={attrValue}
        onChange={(e) =>
          handleChange(attrName, attrType, {
            index: index,
            value: e.target.value,
          })
        }
        fullWidth
      />
      {index !== undefined && (
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => handleClickDeleteListItem(attrName, index)}
          >
            del
          </Button>
        </Grid>
      )}
    </Box>
  );
};

const ElemBool: FC<CommonProps & { attrValue: boolean }> = ({
  attrName,
  attrValue,
  attrType,
  handleChange,
}) => {
  return (
    <Checkbox
      checked={attrValue}
      onChange={(e) =>
        handleChange(attrName, attrType, {
          index: undefined,
          checked: e.target.checked,
        })
      }
    />
  );
};

const ElemObjects: FC<
  CommonProps & {
    attrId?: number;
    attrValue: Array<EntryRetrieveValueAsObject>;
    schemaId: number;
    handleClickDeleteListItem: (attrName: string, index?: number) => void;
  }
> = ({
  attrId,
  attrName,
  attrValue,
  attrType,
  schemaId,
  index,
  handleChange,
  handleClickDeleteListItem,
}) => {
  const [keyword, setKeyword] = useState("");
  const [toggle, setToggle] = useState(false);

  // FIXME Implement and use API V2
  // TODO call it reactively to avoid loading API???
  const referrals = useAsync(async () => {
    const resp = await getAttrReferrals(attrId ?? schemaId, keyword);
    const data = await resp.json();

    attrValue.forEach((v) => {
      if (!data.results.map((r) => r.id).includes(v.id)) {
        data.results.push({ id: v.id, name: v.name });
      }
    });

    return data.results;

  }, [toggle]);

  const defaultValue = useMemo(() => {
    if (attrValue == null) {
      return undefined;
    }
    const matched = referrals.value?.filter((e) =>
      (attrValue as Array<EntryRetrieveValueAsObject>)
        .map((v) => v.id)
        .includes(e.id)
    );
    return matched ? matched : undefined;
  }, [referrals.value]);

  return (
    <Box>
      <Typography>エントリを選択</Typography>
      <Box display="flex" alignItems="center">
        {!referrals.loading && (
          <AirOneReferralBox
            multiple={true}
            options={referrals.value ?? []}
            defaultValue={defaultValue}
            onChange={(e, value) => {
              handleChange(attrName, attrType, value);
            }}
            onInputChange={(e, value) => {
              console.log("onInputChange", e);
              setKeyword(value);
              if (e.key === "Enter") {
                console.log("onInputChange", "enter");
                setToggle(!toggle);
              }
            }}
            onKeyPress={(e) =>{
              console.log("onKeyPress", "enter");
              if (e.key === "Enter") {
                setToggle(!toggle);
              }
            }}
            keyword={keyword}
          />
        )}
        {index !== undefined && (
          <Button
            variant="outlined"
            onClick={() => handleClickDeleteListItem(attrName, index)}
          >
            del
          </Button>
        )}
      </Box>
    </Box>
  );
};

const ElemObject: FC<
  CommonProps & {
    attrId?: number;
    attrValue: EntryRetrieveValueAsObject;
    schemaId: number;
    handleClickDeleteListItem: (attrName: string, index?: number) => void;
  }
> = ({
  attrId,
  attrName,
  attrValue,
  attrType,
  schemaId,
  index,
  handleChange,
  handleClickDeleteListItem,
}) => {
  // FIXME Implement and use API V2
  // TODO call it reactively to avoid loading API???
  const referrals = useAsync(async () => {
    const resp = await getAttrReferrals(attrId ?? schemaId);
    const data = await resp.json();

    if (!data.results.map((r) => r.id).includes(attrValue.id)) {
      data.results.push({ id: attrValue.id, name: attrValue.name });
    }

    return data.results;
  });

  const defaultValue = useMemo(() => {
    if (attrValue == null) {
      return undefined;
    }
    const matched = referrals.value?.filter(
      (e) => (attrValue as EntryRetrieveValueAsObject).id === e.id
    );
    return matched ? matched[0] : undefined;
  }, [referrals.value]);

  return (
    <Box>
      <Typography>エントリを選択</Typography>
      <Box display="flex" alignItems="center">
        {!referrals.loading && (
          <AirOneReferralBox
            multiple={false}
            options={referrals.value ?? []}
            defaultValue={defaultValue}
            onChange={(e, value) => {
              handleChange(
                attrName,
                attrType,
                value
                  ? {
                      index: index,
                      id: value.id,
                      name: value.name,
                      checked: true,
                    }
                  : undefined
              );
            }}
          />
        )}
        {index !== undefined && (
          <Button
            variant="outlined"
            onClick={() => handleClickDeleteListItem(attrName, index)}
          >
            del
          </Button>
        )}
      </Box>
    </Box>
  );
};

const ElemNamedObject: FC<
  CommonProps & {
    attrId?: number;
    attrValue?: { [key: string]: EntryRetrieveValueAsObject };
    schemaId: number;
    handleClickDeleteListItem: (attrName: string, index?: number) => void;
  }
> = ({
  attrId,
  attrName,
  attrValue,
  attrType,
  schemaId,
  index,
  handleChange,
  handleClickDeleteListItem,
}) => {
  const key = attrValue ? Object.keys(attrValue)[0] : "";
  return (
    <Box display="flex">
      <Box>
        <Typography>name</Typography>
        <Input
          type="text"
          value={key}
          onChange={(e) =>
            handleChange(attrName, attrType, {
              index: index,
              key: e.target.value,
              ...attrValue[key],
            })
          }
        />
      </Box>
      <ElemObject
        attrId={attrId}
        schemaId={schemaId}
        attrName={attrName}
        attrValue={attrValue ? attrValue[key] : undefined}
        attrType={attrType}
        index={index}
        handleChange={handleChange}
        handleClickDeleteListItem={handleClickDeleteListItem}
      />
    </Box>
  );
};

const ElemGroups: FC<
  CommonProps & {
    attrValue: Array<EntryRetrieveValueAsObjectSchema>;
  }
> = ({ attrName, attrValue, attrType, index, handleChange }) => {
  // FIXME Implement and use API V2
  // TODO call it reactively to avoid loading API???
  // NOTE it causes a runtime warning on AutoCompletedField
  const groups = useAsync(async () => {
    const _groups = await aironeApiClientV2.getGroups();

    attrValue.forEach((v) => {
      if (!_groups.map((r) => r.id).includes(v.id)) {
        _groups.push({ id: v.id, name: v.name, members: [] });
      }
    });

    return _groups;
  });

  const defaultValue = useMemo(() => {
    if (attrValue == null) {
      return undefined;
    }
    const matched = groups.value?.filter((e) =>
      (attrValue as Array<EntryRetrieveValueAsObjectSchema>)
        .map((v) => v.id)
        .includes(e.id)
    );
    return matched ? matched : undefined;
  }, [groups.value]);

  return (
    <Box>
      <Typography>グループを選択</Typography>
      <Box display="flex" alignItems="center">
        {!groups.loading && (
          <AirOneReferralBox
            multiple={true}
            options={groups.value ?? []}
            defaultValue={defaultValue}
            onChange={(e, value) => {
              handleChange(attrName, attrType, value);
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const ElemGroup: FC<
  CommonProps & {
    attrValue: EntryRetrieveValueAsObjectSchema;
  }
> = ({ attrName, attrValue, attrType, index, handleChange }) => {
  // FIXME Implement and use API V2
  // TODO call it reactively to avoid loading API???
  // NOTE it causes a runtime warning on AutoCompletedField
  const groups = useAsync(async () => {
    const _groups = await aironeApiClientV2.getGroups();

    if (!_groups.map((r) => r.id).includes(attrValue.id)) {
      _groups.push({ id: attrValue.id, name: attrValue.name, members: [] });
    }

    return _groups;
  });

  const defaultValue = useMemo(() => {
    if (attrValue == null) {
      return undefined;
    }
    const matched = groups.value?.filter(
      (e) => (attrValue as EntryRetrieveValueAsObjectSchema).id === e.id
    );
    return matched ? matched[0] : undefined;
  }, [groups.value]);

  return (
    <Box>
      <Typography>グループを選択</Typography>
      <Box display="flex" alignItems="center">
        {!groups.loading && (
          <AirOneReferralBox
            multiple={false}
            options={groups.value ?? []}
            defaultValue={defaultValue}
            onChange={(e, value) => {
              handleChange(attrName, attrType, {
                index: index,
                id: value.id,
                name: value.name,
                checked: true,
              });
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const ElemDate: FC<
  CommonProps & {
    attrValue: string;
    handleClickDeleteListItem: (attrName: string, index?: number) => void;
  }
> = ({ attrName, attrValue, attrType, handleChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="月日を選択"
        inputFormat="yyyy/MM/dd"
        value={new Date(attrValue)}
        onChange={(date: Date) => {
          handleChange(attrName, attrType, {
            value: `${date.getFullYear()}/${
              date.getMonth() + 1
            }/${date.getDate()}`,
          });
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

interface Props {
  attrName: string;
  attrInfo: EditableEntryAttrs;
  handleChangeAttribute: (
    attrName: string,
    attrType: number,
    valueInfo: any
  ) => void;
  handleClickDeleteListItem: (attrName: string, index?: number) => void;
}

export const EditAttributeValue: FC<Props> = ({
  attrName,
  attrInfo,
  handleChangeAttribute,
  handleClickDeleteListItem,
}) => {
  const djangoContext = DjangoContext.getInstance();

  const handleClickAddListItem = (e, value) => {
    const index = (() => {
      switch (attrInfo.type) {
        case djangoContext.attrTypeValue.array_string:
          return attrInfo.value?.asArrayString?.length;
        case djangoContext.attrTypeValue.array_object:
          return attrInfo.value?.asArrayObject?.length;
        case djangoContext.attrTypeValue.array_named_object:
          return attrInfo.value?.asArrayNamedObject?.length;
        case djangoContext.attrTypeValue.array_group:
          return attrInfo.value?.asArrayGroup?.length;
        default:
          throw new Error(`${attrInfo.type} is not array-like type`);
      }
    })();
    handleChangeAttribute(attrName, attrInfo.type, {
      index: index ?? 0,
      value: value,
    });
  };

  switch (attrInfo.type) {
    case djangoContext.attrTypeValue.object:
      return (
        <ElemObject
          attrId={attrInfo.id}
          attrName={attrName}
          attrValue={attrInfo.value.asObject}
          attrType={attrInfo.type}
          schemaId={attrInfo.schema.id}
          handleChange={handleChangeAttribute}
          handleClickDeleteListItem={handleClickDeleteListItem}
        />
      );

    case djangoContext.attrTypeValue.boolean:
      return (
        <ElemBool
          attrName={attrName}
          attrValue={attrInfo.value.asBoolean}
          attrType={attrInfo.type}
          handleChange={handleChangeAttribute}
        />
      );

    case djangoContext.attrTypeValue.string:
    case djangoContext.attrTypeValue.text:
      return (
        <ElemString
          attrName={attrName}
          attrValue={attrInfo.value.asString}
          attrType={attrInfo.type}
          handleChange={handleChangeAttribute}
          handleClickDeleteListItem={handleClickDeleteListItem}
        />
      );

    case djangoContext.attrTypeValue.date:
      return (
        <ElemDate
          attrName={attrName}
          attrValue={attrInfo.value.asString}
          attrType={attrInfo.type}
          handleChange={handleChangeAttribute}
          handleClickDeleteListItem={handleClickDeleteListItem}
        />
      );

    case djangoContext.attrTypeValue.named_object:
      return (
        <ElemNamedObject
          attrId={attrInfo.id}
          attrName={attrName}
          attrValue={attrInfo.value.asNamedObject}
          attrType={attrInfo.type}
          schemaId={attrInfo.schema.id}
          handleChange={handleChangeAttribute}
          handleClickDeleteListItem={handleClickDeleteListItem}
        />
      );

    case djangoContext.attrTypeValue.array_object:
      return (
        <ElemObjects
          attrId={attrInfo.id}
          attrName={attrName}
          attrValue={attrInfo.value.asArrayObject}
          attrType={attrInfo.type}
          schemaId={attrInfo.schema.id}
          handleChange={handleChangeAttribute}
          handleClickDeleteListItem={handleClickDeleteListItem}
        />
      );

    case djangoContext.attrTypeValue.array_string:
      return (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleClickAddListItem(e, "")}
          >
            add
          </Button>
          <List>
            {attrInfo.value.asArrayString?.map((info, n) => (
              <ListItem key={n}>
                <ElemString
                  attrName={attrName}
                  attrValue={info}
                  attrType={attrInfo.type}
                  index={n}
                  handleChange={handleChangeAttribute}
                  handleClickDeleteListItem={handleClickDeleteListItem}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      );

    case djangoContext.attrTypeValue.array_named_object:
      return (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleClickAddListItem(e, { "": [] })}
          >
            add
          </Button>
          <List>
            {attrInfo.value.asArrayNamedObject?.map((info, n) => (
              <ListItem key={n}>
                <ElemNamedObject
                  attrId={attrInfo.id}
                  attrName={attrName}
                  attrValue={info}
                  attrType={attrInfo.type}
                  schemaId={attrInfo.schema.id}
                  index={n}
                  handleChange={handleChangeAttribute}
                  handleClickDeleteListItem={handleClickDeleteListItem}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      );

    case djangoContext.attrTypeValue.array_group:
      return (
        <ElemGroups
          attrName={attrName}
          attrValue={attrInfo.value.asArrayGroup}
          attrType={attrInfo.type}
          handleChange={handleChangeAttribute}
        />
      );

    case djangoContext.attrTypeValue.group:
      return (
        <ElemGroup
          attrName={attrName}
          attrValue={attrInfo.value.asGroup}
          attrType={attrInfo.type}
          handleChange={handleChangeAttribute}
        />
      );
  }
};
