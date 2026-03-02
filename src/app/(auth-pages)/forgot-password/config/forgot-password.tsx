import { FormLayout } from "@/uicomponents/form";

export const forgotPasswordConfig = {
  meta: {
    name: "forgotPassword",
    className: "forgot-password",
    layout: "vertical" as FormLayout,
  },
  fields: {
    email:{
      item: {
        name: "email",
        label: "form.forgotPassword.email.label",
        rules: [
          { required: true, type: "email", message: "form.forgotPassword.email.required" },
        ],
      },
      input: {
        type: "text",
        placeholder: "form.forgotPassword.email.placeholder",
      },
    }
  },
};
