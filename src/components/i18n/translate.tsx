"use client";

import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface ITranslateProps {
  i18nKey: string;
  options?: Record<string, unknown>;
  show?: boolean;
  addSpaceAfter?: boolean;
  addSpaceBefore?: boolean;
}

export const Translate: FC<ITranslateProps> = ({
  i18nKey,
  options,
  show = true,
  addSpaceAfter = false,
  addSpaceBefore = false,
}) => {
  const { t } = useTranslation();
  if (!show) {
    return null;
  }
  return (
    <>
      {addSpaceBefore ? " " : null}
      {t(i18nKey, options)}
      {addSpaceAfter ? " " : null}
    </>
  );
};
