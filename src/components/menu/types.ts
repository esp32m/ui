export interface IMenuItem {
  name: string;
  title?: string;
  icon?: React.ComponentType;
}

export interface IMenu {
  name?: string;
  items: Array<IMenuItem>;
}
