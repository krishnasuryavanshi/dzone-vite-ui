import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactCompiler from "eslint-plugin-react-compiler";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist/", "build/", "node_modules/"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react-compiler": reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react-compiler/react-compiler": "error",
      "react/forbid-elements": [
        "warn",
        {
          forbid: [
            { element: "div", message: "Use <Flex>, <Space>, or <DzBox> instead." },
            { element: "span", message: "Use <Text> instead." },
            { element: "p", message: "Use <Text> instead." },
            { element: "button", message: "Use <Button> instead." },
            { element: "input", message: "Use <Input> instead." },
            { element: "select", message: "Use <Select> instead." },
            { element: "textarea", message: "Use <TextArea> instead." },
            { element: "a", message: "Use <Link> instead." },
            { element: "h1", message: "Use <Title level={1}> instead." },
            { element: "h2", message: "Use <Title level={2}> instead." },
            { element: "h3", message: "Use <Title level={3}> instead." },
            { element: "h4", message: "Use <Title level={4}> instead." },
            { element: "h5", message: "Use <Title level={5}> instead." },
            { element: "h6", message: "Use <Title level={6}> instead." },
            { element: "img", message: "Use <Image> instead." },
            { element: "table", message: "Use <Table> instead." },
            { element: "ul", message: "Use <List> instead." },
            { element: "li", message: "Use <List> instead." },
            { element: "form", message: "Use <Form> instead." },
            { element: "label", message: "Use <FormItem> instead." },
          ],
        },
      ],
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            { name: "antd", message: "Import from '@/components/uicomponents' instead." },
            { name: "@ant-design/icons", message: "Import from '@/components' instead." },
          ],
        },
      ],
    },
  },

  // Exempt components folder — wrappers need direct antd/HTML access
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
      "react/forbid-elements": "off",
    },
  },

  prettier,
);
