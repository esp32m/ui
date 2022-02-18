import React from 'react';
import { diff } from 'deep-object-diff';
import { FormikConfig, FormikValues } from 'formik';
import { Save } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import { MuiForm, WidgetBox, Backend } from '..';
import { useSelector } from 'react-redux';

const StyledIconButton = styled(IconButton)({
  padding: 8,
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
    await Backend.setConfig(name, v);
  };
  const { name, children, ...other } = props;
  const fp = {
    onSubmit: handleSubmit,
    ...other,
  };
  return <MuiForm {...fp}>{children}</MuiForm>;
}

export const Box = (props: React.PropsWithChildren<IProps>) => {
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
                <StyledIconButton
                  aria-label="save settings"
                  onClick={controller.submitForm}
                >
                  <Save />
                </StyledIconButton>
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

export function useModuleConfig<T = unknown>(name: string): [T, () => void] {
  const [gen, setGen] = React.useState(0);
  React.useEffect(() => {
    Backend.requestConfig(name);
  }, [gen]);
  const config = useSelector<Backend.IRootState, T>((state) =>
    Backend.selectConfig<T>(state, name)
  );
  return [config, () => setGen(gen + 1)];
}
