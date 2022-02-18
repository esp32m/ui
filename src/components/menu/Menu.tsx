import React from 'react';
import {
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { IMenu, IMenuItem } from './types';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const ItemIcon = styled(ListItemIcon)({
  icon: {
    minWidth: 44,
  },
});

interface IMenuProps {
  menu: IMenu;
  collapsed?: boolean;
}


const Menu = ({menu }:IMenuProps) => {
  const navigate=useNavigate();
  function buildListItems(path: string, items: Array<IMenuItem>) {
      const result = [];
      for (const item of items) {
        const p = path + '/' + item.name;
        const children = [];
        if (item.icon)
          children.push(
            <ItemIcon key={'icon'}>
              <Icon>{React.createElement(item.icon)}</Icon>
            </ItemIcon>
          );
        if (item.title)
          children.push(
            <ListItemText
              key={'text'}
              primary={item.title}
              primaryTypographyProps={{ noWrap: true }}
            ></ListItemText>
          );
        const onClick = () => navigate(p);
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
    return <List>{buildListItems('', menu.items)}</List>;
  };

export { Menu };
