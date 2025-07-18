export interface AppInfo {
  name: string;
  address: string;
  favicon?: string;
  terms_of_service?: string;
  privacy_policy?: string;
  support?: string;
  version: number;
  invite_only?: boolean;
  background?: string;
}

export interface User {
  id: string;
  preferredUsername: string;
  summary?: string;
  avatar?: string;
  flags: number;
  published: string;
  publicKeys: Key[];
}

export interface Key {
  id: string;
  owner: string;
  publicKeyPem: string;
  createdAt: string;
}

export interface ServerError {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: any;
  errors?: inError[];
}

export interface inError {
  field: string;
  message: string;
}

export class ServerErrorClass extends Error {
  json: ServerError;

  constructor(jsonError: ServerError) {
    super(jsonError.detail);
    this.json = jsonError;
    this.name = "ServerErrorClass";
  }
}
