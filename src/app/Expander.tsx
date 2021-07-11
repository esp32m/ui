import React from 'react';
import { ExpandMore } from '@material-ui/icons';
import {
  Typography,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  StyledComponentProps,
  Theme,
  createStyles,
  makeStyles,
  WithStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: theme.typography.fontWeightMedium,
    },
    content: {
      padding: 8,
      width: '100%',
    },
  })
);

interface IProps {
  title?: string;
  defaultExpanded?: boolean;
}

function Expander({
  title,
  children,
  defaultExpanded,
}: React.PropsWithChildren<IProps>) {
  const classes = useStyles();
  return (
    <Accordion defaultExpanded={defaultExpanded}>
      {title && (
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>{title}</Typography>
        </AccordionSummary>
      )}
      <AccordionDetails>
        <Typography component="div" className={classes.content}>
          {children}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default Expander;
