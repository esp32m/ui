import { ReactElement } from 'react';
import { BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface INavItem {
  title: string;
  path: string;
  icon?: ReactElement;
  children?: Array<INavItem>;
}

export interface NavListProps extends INavItem {
  info?: ReactElement;
}

export type NavItemProps = {
  item: NavListProps;
  isCollapse?: boolean;
  active?: boolean | undefined;
  open?: boolean;
  onOpen?: VoidFunction;
  onMouseEnter?: VoidFunction;
  onMouseLeave?: VoidFunction;
};

export type NavSectionConfig = {
  subheader?: string;
  items: NavListProps[];
};

export type INavMenu = {
  title?: string;
  logo?: ReactElement;
  sections: Array<NavSectionConfig>;
};

export interface NavSectionProps extends BoxProps {
  isCollapse?: boolean;
  navConfig: Array<NavSectionConfig>;
}
