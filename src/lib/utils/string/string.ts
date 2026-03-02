import { isEmpty, startCase, toLower } from "lodash";

export const capitalize = (str: string) => {
    if(isEmpty(str)) {
        return "";
    }
    return startCase(toLower(str));
}