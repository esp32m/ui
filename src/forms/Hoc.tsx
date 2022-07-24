import { Grid, GridProps } from '@mui/material';
import { isBoolean } from 'lodash';

interface IProps {
  grid?: GridProps | boolean;
  children: React.ReactElement;
}

export default (props: IProps) => {
  const { grid, children } = props;
  if (!grid) return children;
  const gp: GridProps = isBoolean(grid) ? { item: true, xs: true } : grid;
  return <Grid {...gp}>{children}</Grid>;
};
