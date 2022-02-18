import { ReactElement } from 'react';
import { BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export type NavListProps = {
  title: string;
  path: string;
  icon?: ReactElement;
  info?: ReactElement;
  children?: {
    title: string;
    path: string;
    children?: { title: string; path: string }[];
  }[];
};

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
