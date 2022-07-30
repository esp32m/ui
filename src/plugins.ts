export interface IPlugin {
  readonly name: string;
  readonly use?: IPlugin | Array<IPlugin>;
}

const IndexKey = Symbol('plugin-index');

type RegisteredPlugin<T extends IPlugin> = {
  [IndexKey]: number;
} & T;

const plugins: {
  [name: string]: RegisteredPlugin<IPlugin>;
} = {};

let pluginsList: Array<IPlugin> | null = null;

let recursionCounter = 0;

function ensureRegistered(plugin: IPlugin) {
  const name = plugin?.name;
  if (!name) throw 'invalid use clause';
  if (plugins[name]) return;
  try {
    recursionCounter++;
    registerPlugin(plugin);
  } finally {
    recursionCounter--;
  }
}

export const registerPlugin = <T extends IPlugin>(
  plugin: T
): RegisteredPlugin<T> => {
  if (recursionCounter > 100) throw 'plugin recursion too deep';
  if (!plugin) throw 'plugin cannot be empty';
  if (!plugin.name) throw 'plugin must have a name';
  if (plugins[plugin.name]) throw 'duplicate plugin: ' + plugin.name;
  const { use } = plugin;
  if (use)
    if (Array.isArray(use)) use.forEach(ensureRegistered);
    else ensureRegistered(use);
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
  predicate?: (p: T) => boolean
): Array<T> => {
  if (!pluginsList) {
    const plist = Object.values(plugins);
    plist.sort((a, b) => a[IndexKey] - b[IndexKey]);
    pluginsList = plist.map((p) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [IndexKey]: _, ...rest } = p;
      return rest;
    });
  }
  let list = pluginsList as T[];
  if (predicate) list = list.filter(predicate);
  return list;
};

export const use = (...plugins: IPlugin[]) => plugins.forEach(registerPlugin);
