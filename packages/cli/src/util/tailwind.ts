import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.mjs";

const fullConfig = resolveConfig(tailwindConfig);

export const colors = fullConfig.theme?.colors as unknown as Record<
  string,
  string
>;
export default fullConfig;
