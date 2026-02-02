import type { ExpoConfig } from 'expo/config';

import baseConfig from './app.json';

type PluginEntry = string | [string, ...unknown[]];

const isFossBuild = process.env.FOSS_BUILD === '1' || process.env.FOSS_BUILD === 'true';

const rawConfig = (baseConfig as { expo: ExpoConfig }).expo ?? (baseConfig as ExpoConfig);

const plugins = Array.isArray(rawConfig.plugins) ? [...rawConfig.plugins] : [];
const filteredPlugins = isFossBuild
  ? (plugins.filter((plugin: PluginEntry) => {
      if (typeof plugin === 'string') {
        return plugin !== 'expo-notifications';
      }
      return plugin[0] !== 'expo-notifications';
    }) as PluginEntry[])
  : plugins;

const android = rawConfig.android ? { ...rawConfig.android } : undefined;
if (android && Array.isArray(android.permissions)) {
  android.permissions = isFossBuild
    ? android.permissions.filter((permission) => permission !== 'POST_NOTIFICATIONS')
    : android.permissions;
}

const config: ExpoConfig = {
  ...rawConfig,
  android,
  plugins: filteredPlugins,
};

export default config;
