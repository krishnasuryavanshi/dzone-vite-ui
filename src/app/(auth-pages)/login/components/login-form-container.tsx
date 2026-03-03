
import React, { useEffect, useState } from "react";
import { loginConfig } from "../config";
import { Form } from "antd";
import { FormFooter } from "./form-footer";
import { SignInButton } from "./sign-in-button";
import NotYou from "./not-you";
import { LoginForm } from "./login-form";
import "./login-form-container.scss";
import { IUserIdentity } from "../types";
import { Store } from "@/services";
import { StorageKey } from "@/lib/enums";
import { decryptAsync } from "@/lib/utils/encryption";
import { FormControl } from "../../components/form-control";

const StoreKey_RememberMe = StorageKey.RememberMe;
const StoreKey_Useridentity = StorageKey.UserIdentity;

export const LoginFormContainer = () => {
  const { fields } = loginConfig;
  const [loginForm] = Form.useForm();
  const [isFullForm, setIsFullForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [defaultUser, setDefaultUser] = useState<IUserIdentity>({});

  useEffect(() => {
    const rememberMe = Store.get(StoreKey_RememberMe) === true;
    if(!rememberMe) {
      setIsLoaded(true);
      return;
    }
    const user = Store.get(StoreKey_Useridentity);
    if(user) {
      decryptAsync(user.password).then((password) => {
        user.password = password;
        setDefaultUser(user as IUserIdentity);
        setIsFullForm(true);
        setIsLoaded(true);
      });
    } else {
      setIsLoaded(true);
    }
  }, []);

  const handleFormModeChange = (value: boolean) => {
    setIsFullForm(value);
  };

  const reset = () => {
    handleFormModeChange(false);
    const defaultUser = {email: null, password: null};
    setDefaultUser(defaultUser)
    loginForm.setFieldsValue(defaultUser);
  };

  if(!isLoaded) {
    return null;
  }

  return (
    <LoginForm loginForm={loginForm} onFormModeChange={handleFormModeChange}>
      <NotYou isFullForm={isFullForm} reset={reset} />
      <FormControl field={fields.email} isDisabled={isFullForm} initialValue={defaultUser.email}/>
      <FormControl field={fields.password} show={isFullForm} initialValue={defaultUser.password}/>
      <FormFooter isFullForm={isFullForm}/>
      <SignInButton isFullForm={isFullForm} />
    </LoginForm>
  );
};
