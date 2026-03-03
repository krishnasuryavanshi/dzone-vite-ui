
import { StorageKey } from "@/lib/enums";
import Cookies from "js-cookie";

const tenant = 'dzone';

const getKey = (key: StorageKey) => `${tenant}-${key}`;

const get = (key: StorageKey) => {
    const dzoneKey = getKey(key);
    const value = Cookies.get(dzoneKey);
    if(value) {
        return JSON.parse(value);
    }
}

const remove = (key: StorageKey) => {
    const dzoneKey = getKey(key);
    Cookies.remove(dzoneKey);
}

const set = (key: StorageKey, value: any) => {
    const dzoneKey = getKey(key);
    value = JSON.stringify(value);
    if(value) {
        Cookies.set(dzoneKey, value);
    }
}

export const Store = {get, set, remove};