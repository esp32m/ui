import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Drawer, Typography } from '@mui/material';
import { useResponsive, cssStyles } from '../../utils';
import { useCollapseDrawer } from './CollapseDrawerContext';
import NavSectionVertical from './Section';
//
import CollapseButton from './CollapseButton';
import { INavMenu } from '../types';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
  menu: INavMenu;
};

export default function NavbarVertical({
  isOpenSidebar,
  onCloseSidebar,
  menu,
}: Props) {

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const {
    isCollapse,
    collapseClick,
    collapseHover,
    onToggleCollapse,
    onHoverEnter,
    onHoverLeave,
  } = useCollapseDrawer();
  const theme = useTheme();
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <Box
      sx={{
        height: 1,
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' }),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {menu.logo && <Box sx={{ width: 21, height: 24 }}>{menu.logo}</Box>}
          {!isCollapse && menu.title && (
            <Typography
              noWrap
              component="h1"
              variant="h6"
              color={'textSecondary'}
              sx={{ paddingLeft: 1 }}
            >
              {menu.title}
            </Typography>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {isDesktop && !isCollapse && (
            <CollapseButton
              onToggleCollapse={onToggleCollapse}
              collapseClick={collapseClick}
            />
          )}
        </Stack>
      </Stack>

      <NavSectionVertical navConfig={menu.sections} isCollapse={isCollapse} />

      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse
            ? theme.config.navbar.DASHBOARD_COLLAPSE_WIDTH
            : theme.config.navbar.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{ sx: { width: theme.config.navbar.DASHBOARD_WIDTH } }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: theme.config.navbar.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: theme.config.navbar.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                 boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
