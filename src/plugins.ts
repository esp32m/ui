import isArray from 'lodash/isArray';

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

const locked: {
  [name: string]: boolean;
} = {};

let allPlugins: Array<IPlugin> = [];

export class Plugins {
  static register<T extends IPlugin>(plugin: T): RegisteredPlugin<T> {
    if (!plugin) throw 'plugin cannot be empty';
    if (!plugin.name) throw 'plugin must have a name';
    if (plugins[plugin.name])
      throw 'plugin ' + plugin.name + ' already registered';
    for (const k in plugin)
      if (locked[k])
        console.warn(
          'plugin ' + plugin.name + ' registering ' + k + ' too late'
        );
    //       console.debug(`plugin ${plugin.name} registered`);
    const result = (plugins[plugin.name] = {
      ...plugin,
      [IndexKey]: Object.keys(plugins).length,
    });
    allPlugins = Object.values(plugins).sort(
      (a, b) => a[IndexKey] - b[IndexKey]
    );
    return result;
  }

  static find<T extends IPlugin>(name: string): T {
    return plugins[name] as unknown as T;
  }

  static all(): Array<IPlugin> {
    return allPlugins;
  }

  static lock(names: string | string[]): void {
    if (isArray(names)) for (const n of names) locked[n] = true;
    else locked[names] = true;
  }
}
