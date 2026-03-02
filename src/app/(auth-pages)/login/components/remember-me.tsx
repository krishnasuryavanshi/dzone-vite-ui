import { Checkbox } from "@/uicomponents/form/input";
import React from "react";
import type { CheckboxProps } from "antd/lib/checkbox";
import { Store } from "@/services";
import { StorageKey } from "@/lib/enums";
import { Translate } from "@/components/i18n";

const StoreKey_RememberMe = StorageKey.RememberMe;

export const RememberMe = () => {
  const defaultChecked = Store.get(StoreKey_RememberMe) === true;
  const onChange: CheckboxProps["onChange"] = (e) => {
    Store.set(StoreKey_RememberMe, e.target.checked);
  };
  return (
    <Checkbox
      onChange={onChange}
      className="rememberMe checkbox-remember-me action-remember-me"
      defaultChecked={defaultChecked}
    >
      <Translate i18nKey="form.login.rememberMe" />
    </Checkbox>
  );
};
