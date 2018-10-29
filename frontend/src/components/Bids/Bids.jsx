import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
});

let id = 0;
function createData(price, name, rate) {
  id += 1;
  return { id, price, name, rate };
}

const rows = [
  createData(450, 'Mert Kizil', 3.5),
  createData(400, 'Selin Sezen', 4.5),
  createData(425, 'Deniz Gökçe', 4.0),
];

function Bids(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell numeric>Suggested Price</TableCell>
            <TableCell>Bid Owner</TableCell>
            <TableCell numeric>Bid Owner's Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row" numeric>
                  {row.price}
                </TableCell>
                <TableCell >{row.name}</TableCell>
                <TableCell numeric>{row.rate}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

Bids.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Bids);