
import { StorageKey } from "@/lib/enums";

const tenant = 'dzone';

const getKey = (key: StorageKey) => `${tenant}-${key}`;

const get = (key: StorageKey) => {
    const dzoneKey = getKey(key);
    const value = localStorage.getItem(dzoneKey);
    if(value) {
        return JSON.parse(value);
    }
}

const remove = (key: StorageKey) => {
    const dzoneKey = getKey(key);
    localStorage.removeItem(dzoneKey);
}

const set = (key: StorageKey, value: any) => {
    const dzoneKey = getKey(key);
    value = JSON.stringify(value);
    if(value) {
        localStorage.setItem(dzoneKey, value);
    }
}

export const Store = {get, set, remove};