export interface IPlugin {
  readonly name: string;
  [key: string]: unknown;
}

const IndexKey = Symbol('plugin-index');

type RegisteredPlugin<T extends IPlugin> = {
  [IndexKey]: number;
} & T;

const plugins: {
  [name: string]: RegisteredPlugin<IPlugin>;
} = {};

let pluginsList: Array<RegisteredPlugin<IPlugin>> | null = null;

export const registerPlugin = <T extends IPlugin>(
  plugin: T
): RegisteredPlugin<T> => {
  if (!plugin) throw 'plugin cannot be empty';
  if (!plugin.name) throw 'plugin must have a name';
  if (plugins[plugin.name]) throw 'duplicate plugin: ' + plugin.name;
  const result = {
    ...plugin,
    [IndexKey]: Object.keys(plugins).length,
  };
  plugins[plugin.name] = result;
  pluginsList = null;
  return result;
};

export const findPlugin = <T extends IPlugin>(name: string): T =>
  plugins[name] as unknown as T;

export const usePlugins = <T extends IPlugin>(
  predicate?: (p: IPlugin) => boolean
): Array<T> => {
  let list = pluginsList;
  if (!list) {
    list = Object.values(plugins);
    list.sort((a, b) => a[IndexKey] - b[IndexKey]);
    pluginsList = list;
  }
  if (predicate) list = list.filter(predicate);
  return list as unknown as T[];
};
