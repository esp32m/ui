import React from 'react';
import { ButtonBar, IButtonProps } from '../app';
import { useFormikContext } from 'formik';

interface IProps {
  buttons?: Array<IButtonProps>;
}

export default ({ buttons }: IProps) => {
  if (!buttons?.length) return null;
  const controller = useFormikContext();
  return (
    <ButtonBar
      disabled={controller.isSubmitting}
      buttons={buttons.map((b) =>
        b.submits ? { ...b, onClick: controller.handleSubmit } : b
      )}
    />
  );
};
