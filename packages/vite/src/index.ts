import { defineConfig, mergeConfig, type PluginOption, type UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export interface UniframeViteOptions {
  plugins?: PluginOption[];
  root?: string;
}

export function uniframeVitePlugins(plugins: PluginOption[] = []): PluginOption[] {
  return [tsconfigPaths(), ...plugins];
}

export function defineUniframeViteConfig(
  config: UserConfig = {},
  options: UniframeViteOptions = {}
) {
  return defineConfig(
    mergeConfig(
      {
        root: options.root,
        plugins: uniframeVitePlugins(options.plugins ?? [])
      },
      config
    )
  );
}
