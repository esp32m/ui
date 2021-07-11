import React from 'react';
import { FormikConfig, FormikValues } from 'formik';
import { Save } from '@material-ui/icons';
import { makeStyles, IconButton, Tooltip } from '@material-ui/core';
import { diff } from 'deep-object-diff';

import { MuiForm, WidgetBox, Backend } from '..';

const useStyles = makeStyles({
  icon: {
    padding: 8,
  },
});

interface IProps extends Partial<FormikConfig<FormikValues>> {
  name: string;
  title: string;
  initial: any;
}

interface IFormProps extends Partial<FormikConfig<FormikValues>> {
  name: string;
  initial: any;
}

export function Form(props: React.PropsWithChildren<IFormProps>) {
  const handleSubmit = async (values: FormikValues) => {
    const v = diff(props.initial, values);
    await Backend.setConfig(props.name, v);
  };
  const { name, children, ...other } = props;
  const fp = {
    onSubmit: handleSubmit,
    ...other,
  };
  return <MuiForm {...fp}>{props.children}</MuiForm>;
}

export const Box = (props: React.PropsWithChildren<IProps>) => {
  const classes = useStyles();
  const { title, children, ...other } = props;
  return (
    <Form {...other}>
      {(controller) => (
        <WidgetBox
          title={title}
          progress={controller.isSubmitting}
          action={
            controller.dirty ? (
              <Tooltip title="save changes">
                <IconButton
                  className={classes.icon}
                  aria-label="save settings"
                  onClick={controller.submitForm}
                >
                  <Save />
                </IconButton>
              </Tooltip>
            ) : undefined
          }
        >
          {children}
        </WidgetBox>
      )}
    </Form>
  );
};

export function useConfig(name: string) {
  const [gen, setGen] = React.useState(0);
  React.useEffect(() => {
    Backend.requestConfig(name);
  }, [gen]);
  return () => setGen(gen + 1);
}
