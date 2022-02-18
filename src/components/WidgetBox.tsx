import React from 'react';

import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Avatar,
  LinearProgress,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)({
  width: 560,
  minWidth: 400,
  maxWidth: 640,
  margin: 20,
});

const StyledCardHeader = styled(CardHeader)({
  '& .MuiCardHeader-action': {
    margin: 0,
  },
});

const StyledDivider = styled(Divider)({
  marginTop: 4,
});

interface IProps {
  title?: any;
  header?: React.ReactElement;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  progress?: boolean | number;
}

export function WidgetBox({
  title,
  header,
  children,
  avatar,
  action,
  progress,
}: React.PropsWithChildren<IProps>) {
  let pc;
  switch (typeof progress) {
    case 'boolean':
      if (progress) pc = <LinearProgress />;
      break;
    case 'number':
      pc = <LinearProgress variant="determinate" value={progress} />;
      break;
  }
  if (!pc) pc = <StyledDivider />;
  let h = header;
  if (!h && title) {
    h = (
      <>
        <StyledCardHeader
          avatar={avatar || <Avatar>{title[0]}</Avatar>}
          title={title}
          titleTypographyProps={{ variant: 'h5' }}
          action={action}
        />
        {pc}
      </>
    );
  }
  return (
    <Grid item>
      <StyledCard>
        {h}
        <CardContent>{children}</CardContent>
        <div />
      </StyledCard>
    </Grid>
  );
}
