import { FormLayout } from "@/uicomponents/form";
import { t } from "i18next";

function setTransKey(transKey: string){
    return function getTransKey(key: string) {
        return transKey + "." + key;
    }
}

function validationRules(rules: any[], getFieldsTransKey: Function): any[] {
    return rules.map((rule: any) => {
        const ruleOb = {...rule};
        if (ruleOb.hasOwnProperty("required")) {
            ruleOb.message = t(getFieldsTransKey("requiredValidationError"));
        }
        if (ruleOb.hasOwnProperty("pattern")) {
            ruleOb.message = t(getFieldsTransKey("patternValidationError"));
        }
        // if (ruleOb.hasOwnProperty("max")) {
        //     ruleOb.message = "maxValidationError";
        // }
        return ruleOb;
    });
}

export function useFormConfig(formConfig: any) {
    const headingsTransKeys = formConfig.info.headingsTransKeys;
    const getHeadingTransKey = setTransKey(headingsTransKeys);
    const headings = {
        heading: getHeadingTransKey("formHeader"),
        subHeading: getHeadingTransKey("formSubHeader"),
    };

    const fieldsTransKeys = formConfig.info.fieldsTransKeys;

    const fields: any = [];
    Object.keys(formConfig.fields).forEach((key) => {
        const getFieldsTransKey = setTransKey(fieldsTransKeys+"."+key);
        const item = {
            label: getFieldsTransKey("label"),
            name: key,
            rules: validationRules(formConfig.fields[key].item.rules, getFieldsTransKey),
        };
        const input: any = {
            type: formConfig.fields[key].input.type,
            placeholder: getFieldsTransKey("placeholder"),
        };
        if(formConfig.fields[key].input.disabled) {
            input.disabled = true;
        }
        if(formConfig.fields[key].input.options?.length) {
            input.options = formConfig.fields[key].input.options;
        }
        if(formConfig.fields[key].input.onChange) {
            input.onChange = formConfig.fields[key].input.onChange;
        }
        fields.push({
            item,
            input
        });
    })
    
    const config = {
        meta: {...formConfig.meta, layout: formConfig.meta.layout as FormLayout},
        fields,
        headings
    }

    return config;
}