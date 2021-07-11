import React, { MouseEventHandler } from 'react';

import { Button, createStyles, Theme, makeStyles } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonBar: {
      display: 'flex',
      borderRadius: `0px 0px ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
      width: '100%',
      marginTop: 24,
      justifyContent: 'flex-end',
      //        backgroundColor: 'rgb(250,250,250)'
    },
    button: {
      marginRight: 12,
      marginTop: 6,
      marginBottom: 6,
    },
  })
);

export interface IButtonProps {
  name: string;
  title?: string;
  submits?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<any>;
}

interface IProps {
  buttons: Array<IButtonProps>;
  disabled?: boolean;
  onClick?: (name: string) => void;
}

function ButtonBar({ buttons, disabled, onClick }: IProps) {
  const classes = useStyles();
  return (
    <div className={classes.buttonBar}>
      {buttons.map((b) => {
        if (!b || !b.name) return;
        const bp: ButtonProps & React.ClassAttributes<any> = {
          key: b.name,
          variant: 'contained',
          color: 'primary',
          className: classes.button,
          disabled: disabled || b.disabled,
        };
        if (onClick || b.onClick)
          if (onClick && b.onClick)
            bp.onClick = (e) => {
              onClick!(b.name);
              b.onClick!(e);
            };
          else if (onClick) bp.onClick = () => onClick!(b.name);
          else bp.onClick = b.onClick;
        return <Button {...bp}>{b.title || b.name}</Button>;
      })}
    </div>
  );
}

export default ButtonBar;
