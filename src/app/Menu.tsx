import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  Icon,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { IMenu, IMenuItem } from './types';

const useStyles = makeStyles({
  icon: {
    minWidth: 44,
  },
});

interface IMenuProps {
  menu: IMenu;
  collapsed?: boolean;
}

interface IConnectedMenuProps extends IMenuProps {
  push: (path: string) => void;
}

function menuName(menu: IMenu) {
  return menu?.name || 'main';
}

const Menu = connect(undefined, { push })(
  ({ menu, push }: IConnectedMenuProps) => {
    function buildListItems(path: string, items: Array<IMenuItem>) {
      const result = [];
      for (const item of items) {
        const p = path + '/' + item.name;
        const children = [];
        if (item.icon)
          children.push(
            <ListItemIcon key={'icon'} className={classes.icon}>
              <Icon>{React.createElement(item.icon)}</Icon>
            </ListItemIcon>
          );
        if (item.title)
          children.push(
            <ListItemText
              key={'text'}
              primary={item.title}
              primaryTypographyProps={{ noWrap: true }}
            ></ListItemText>
          );
        let onClick = () => push(p);
        const liprops = {
          key: item.name,
          onClick,
        };
        result.push(
          <ListItem button {...liprops}>
            {children}
          </ListItem>
        );
      }
      return result;
    }
    const classes = useStyles();
    return <List>{buildListItems('', menu.items)}</List>;
  }
);

export { Menu };
