/**
 * Resource-related types — extracted from Refine shims.
 */
import React from 'react';

export interface BaseRecord {
  id?: string | number;
  [key: string]: any;
}

export interface HttpError {
  message: string;
  statusCode: number;
  [key: string]: any;
}

export interface IResourceItem {
  name: string;
  list?: string;
  create?: string;
  edit?: string;
  show?: string;
  meta?: {
    label?: string;
    icon?: React.ReactNode;
    permissions?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export type ResourceProps = IResourceItem;
