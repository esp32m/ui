import React, { ComponentType } from 'react';
import { Alert as MuiAlert, Color } from '@material-ui/lab';
import { formatError } from '..';

interface IUseAlertResult {
  alertProps: IAlertProps;
  check: (t: any) => void;
}

interface IAlertProps {
  content?: string | React.ReactNode;
  severity: Color;
}

export const Alert = ({ content, severity }: IAlertProps) =>
  content ? (
    <MuiAlert style={{ marginTop: 20 }} severity={severity}>
      {content}
    </MuiAlert>
  ) : (
    <div />
  );

export const useAlert = (): IUseAlertResult => {
  const [text, setText] = React.useState<string | undefined>(undefined);
  const [severity, setSeverity] = React.useState<Color>('error');
  return {
    alertProps: { severity, content: text },
    check: (t: any, s?: Color) => {
      if (t instanceof Promise) {
        t.then(() => setText(undefined)).catch((e: any) =>
          setText(formatError(e))
        );
      } else if (t && t.error) setText(formatError(t.error));
      else setText(undefined);
      if (s) setSeverity(s);
      return t;
    },
  };
};
