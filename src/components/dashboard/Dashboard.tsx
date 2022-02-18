import React, { useEffect, useState } from 'react';
import { Box, styled, Typography } from '@mui/material';

import { INavMenu } from '../navbar';
import { NavbarVertical } from '../';
import { useCollapseDrawer } from '../navbar';
import Header from './Header';

type MainStyleProps = {
  collapseClick: boolean;
};

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<MainStyleProps>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: theme.config.header.MOBILE_HEIGHT + 24,
  paddingBottom: theme.config.header.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: theme.config.header.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: theme.config.header.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${theme.config.navbar.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: theme.config.navbar.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

interface IProps {
  name: string;
  menu?: INavMenu;
}

export function Dashboard({
  children,
  name,
  menu,
}: React.PropsWithChildren<IProps>) {
  useEffect(() => {
    if (name) document.title = name;
  }, [name]);
  const [open, setOpen] = useState(false);
  const { collapseClick, isCollapse } = useCollapseDrawer();
  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
      }}
    >
      {name && (
        <Header isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)}>
          <Typography noWrap component="h1" variant="h6" color="textSecondary">
            {name}
          </Typography>
        </Header>
      )}
      {menu && (
        <NavbarVertical
          isOpenSidebar={open}
          onCloseSidebar={() => setOpen(false)}
          menu={menu}
        />
      )}
      <MainStyle collapseClick={collapseClick}>{children}</MainStyle>
    </Box>
  );
}
