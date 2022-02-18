import { memo } from 'react';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import NavSectionHorizontal from './Section';
import { INavMenu } from '..';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  transition: theme.transitions.create('top', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  width: '100%',
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
  boxShadow: theme.customShadows.z8,
  top: theme.config.header.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

type Props = {
  menu: INavMenu;
};

function NavbarHorizontal({ menu }: Props) {
  return (
    <RootStyle>
      <Container maxWidth={false}>
        <NavSectionHorizontal navConfig={menu.sections} />
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontal);
