import nextVitals from "eslint-config-next/core-web-vitals";

const ignoredPaths = [
  ".next/**",
  "out/**",
  "node_modules/**",
  "legacy/**",
  "public/**",
  "BLOG_CONSTANTS/**",
];

const eslintConfig = [
  ...nextVitals,
  {
    ignores: ignoredPaths,
  },
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/link-passhref": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
