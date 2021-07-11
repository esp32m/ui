import React from 'react';
import isArray from 'lodash/isArray';

import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

interface INameValue {
  name: any;
  value: any;
}

interface IProps {
  list: Array<INameValue | Array<any>>;
}

export default ({ list }: IProps) => {
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
