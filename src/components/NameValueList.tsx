import { isArray } from 'lodash';
import { Table, TableRow, TableCell, TableBody } from '@mui/material';

interface INameValue {
  name: any;
  value: any;
}

interface IProps {
  list: Array<INameValue | Array<any>>;
}

export const NameValueList = ({ list }: IProps) => {
  const rows = list.map((row, i) => {
    let name, value;
    if (isArray(row)) {
      name = row[0];
      value = row[1];
    } else {
      name = row.name;
      value = row.value;
    }
    return (
      <TableRow key={'row-' + i}>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="right">{value}</TableCell>
      </TableRow>
    );
  });
  return (
    <Table>
      <TableBody>{rows}</TableBody>
    </Table>
  );
};
