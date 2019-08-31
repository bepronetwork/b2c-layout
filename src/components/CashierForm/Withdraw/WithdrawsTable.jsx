

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import FilterListIcon from 'mdi-react/FilterListIcon';
import { Numbers, AddressConcat } from '../../../lib/ethereum/lib';
import withdrawStatus from './codes';
import { Button, Typography } from "components";
import "./index.css";
import { etherscanLinkID } from '../../../lib/api/apiConfig';
import { CopyText } from '../../../copy';
import { Row, Col } from 'reactstrap';
import { fromSmartContractTimeToMinutes } from '../../../lib/helpers';
let counter = 0;


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const fromDatabasetoTable = (data) => {
    if(!data){return null}
    let sortedByTimestamp = data.sort(( a, b) => {
        return new Date(b.creation_timestamp) - new Date(a.creation_timestamp)
    });
	let res = sortedByTimestamp.map( (data) => {
        return {
            id :  data._id,
			amount : Numbers.toFloat(data.amount),
            confirmed: data.confirmed ? 'Confirmed' : 'Open',
            done :  data.confirmed,
            transactionHash : data.transactionHash,
            creation_timestamp : new Date(data.creation_timestamp),
            creation_date : new Date(data.creation_timestamp).toDateString(),
            address: data.address,
            nonce : data.nonce
		}
    })
    return res;
}


const rows = [
    {
        id: 'amount',
        label: 'Amount',
        numeric: true,
        align : 'center',
        size: 'small'
    },
    {
        id: 'confirmed',
        label: 'Status',
        numeric: false,
        align : 'center',
        size: 'small'
    },
    {
        id: 'withdraw',
        label: 'Withdraw',
        numeric: false,
        align : 'center',
        size: 'small'

    },
    {
        id: 'transactionHash',
        label: 'Tx Hash',
        numeric: false,
        align : 'center',
        size: 'small'

    },
    {
        id: 'creation_date',
        label: 'Creation Date',
        numeric: false,
        align : 'center',
        size: 'small'

    }
];

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return (
            <TableHead>
                <TableRow>
                {rows.map(
                    row => (
                    <StyledTableCell
                        key={row.id}
                        align={row.align ? row.align : row.numeric ? 'right' : 'left'}
                        padding={row.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === row.id ? order : false}
                        size={row.size}
                    >
                        <Tooltip
                        title="Sort"
                        placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                        enterDelay={300}
                        >
                        <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={this.createSortHandler(row.id)}
                        >
                            <Typography variant={'small-body'} color='casper'>
                                {row.label}
                            </Typography>
                        </TableSortLabel>
                        </Tooltip>
                    </StyledTableCell>
                    ),
                    this,
                )}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
        color : 'white'
    },
    highlight:
        theme.palette.type === 'light'
        ? {
            color: 'white',
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
        : {
            color: 'white',
            backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
        color : 'white'
    },
});

let EnhancedTableToolbar = props => {
    const { numSelected, classes, time } = props;

        return (
            <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
            >
            <div className={classes.title}>
                {numSelected > 0 ? (
                <Typography color="white" variant="small-body">
                    {numSelected} selected
                </Typography>
                ) : (
                <Row>
                    <Col md={3}>
                        <Typography variant="h4" id="tableTitle" color={'white'}>
                            Withdraws
                        </Typography>
                    </Col>
                    <Col md={9}>
                        <div style={{marginTop : 5}}>  
                            <Typography variant="small-body" id="tableTitle" color={'casper'}>
                                {time > 0 ?
                                    `Time for Withdraw : ${fromSmartContractTimeToMinutes(time)} hrs`
                                : `You can Withdraw Now`} 
                            </Typography>
                        </div>
                    </Col>
                </Row>
                
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
              
            </div>
            </Toolbar>
        );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        width: '100%',
        margin : 'auto',
        backgroundColor : 'transparent',
        color : 'white',
        marginTop : 40,
        marginBottom : 20,
        border : '2px solid white',
        overflowX : 'auto'
    },
    head : {
        color : 'white'
    },
    pagination : {
        color : 'white'
    },
    body: {
        color : 'white'
    },
    table: {
        height: 200,
        color : 'white'

    },
    tableWrapper: {
        color : 'white',
        overflowX: 'auto',
    },
});

const defaultProps = {
    profit : '0',
    ticker : 'N/A',
}
  


const StyledTableCell = withStyles(theme => ({
    head: {
        color: 'white',
    },
    body : {
        color : 'white'
    }
}))(TableCell);

class WithdrawTable extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            order: 'desc',
            orderBy: 'creation_timestamp',
            selected: [],
            data: props.data ? fromDatabasetoTable(props.data) : [],
            page: 0,
            rowsPerPage: 5,
            ...defaultProps
        };
    }


    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = (props) => {
        let data = props.data;

        this.setState({...this.state, 
            data : fromDatabasetoTable(data),
            ticker : 'DAI'
        })
    }

    isWithdrawAvailable = () => (this.props.time <= 0);

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
        order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
        this.setState(state => ({ selected: state.data.map(n => n.id) }));
        return;
        }
        this.setState({ selected: [] });
    };

  

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes, ln, time } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        const copy = CopyText.Withdraw[ln];

        return (
            <Paper className={classes.root}>
                    <EnhancedTableToolbar numSelected={selected.length} time={time}  />
                        <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}
                        />
                    <TableBody style={{color : 'white'}}>
                        {stableSort(data, getSorting(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(n => {
                            const isSelected = this.isSelected(n.id);
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    style={{padding : 0, color : 'white'}}
                                    aria-checked={isSelected}
                                    tabIndex={-1}
                                    key={n.id}
                                    selected={isSelected}
                                >
                                    <StyledTableCell  style={{width : 20}} align="center">
                                        <Typography variant={'small-body'} color='white'>
                                            {n.amount} {this.props.currency}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell style={{width : 50}} align="center">
                                        <Typography variant={'small-body'} color='white' styleName={withdrawStatus[n.confirmed.toLowerCase()]}>
                                            {n.confirmed}
                                        </Typography>
                                    </StyledTableCell>
                                  
                                    <StyledTableCell align="center">
                                        {
                                            !n.done
                                            ?
                                            <button
                                                styleName='deposit-button'
                                                disabled={!this.isWithdrawAvailable()}
                                                onClick={ () => this.props.withdraw(n)}
                                            >
                                                <Typography color={'white'} variant={'small-body'}>{copy.TABLE.BUTTON_ONE}</Typography>
                                            </button>
                                         : 'Done'}
                                     </StyledTableCell>
                                     <StyledTableCell align="left">
                                        {n.transactionHash ?
                                            <a href={`${etherscanLinkID}/tx/${n.transactionHash}`} target={'_blank'}>
                                                <Typography variant={'small-body'} color='white'>
                                                    {AddressConcat(n.transactionHash)}
                                                </Typography>
                                            </a>
                                        : 
                                            'N/A'
                                        }

                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        <Typography variant={'small-body'} color='white'>
                                            {n.creation_date}
                                        </Typography>
                                    </StyledTableCell>
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 49 * emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    style={{color : 'white'}}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}



WithdrawTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WithdrawTable);