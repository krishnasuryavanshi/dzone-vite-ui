import { Title } from "@/uicomponents";
import React, { FC } from "react";
import { UsersListContainer } from "./components";

const Users: FC = () => {
  return (
    <>
      <title>Users | DZ One</title>
      <UsersListContainer />
    </>
  );
};

export default Users;
