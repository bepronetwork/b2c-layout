
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
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
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Numbers, AddressConcat } from '../../../lib/ethereum/lib';
import withdrawStatus from './codes';
import { Typography } from "components";
import "./index.css";
import { CopyText } from '../../../copy';
import { getApp } from "../../../lib/helpers";
let counter = 0;
let globalProps = null;

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
    const virtual = getApp().virtual;
    let sortedByTimestamp = data.sort(( a, b) => {
        return new Date(b.creation_timestamp) - new Date(a.creation_timestamp)
    });
	let res = sortedByTimestamp.map( (data) => {
        const currency = getApp().currencies.find(c => c._id === data.currency);
        let ticker = currency.ticker;
        let amount = data.amount;

        if (virtual === true) {
            const virtualCurrency = getApp().currencies.find(c => c.virtual === true);

            if(currency && virtualCurrency) {
                const virtualWallet = getApp().wallet.find(w => w.currency._id === virtualCurrency._id);
                const price = virtualWallet ? virtualWallet.price.find(p => p.currency === currency._id).amount : 1;
                ticker = virtualCurrency.ticker;
                amount = data.amount / price;
            }
        }
        return {
            id :  data._id,
			amount : Numbers.toFloat(amount),
            confirmed: data.transactionHash ? 'Confirmed' : 'Confirm',
            done :  data.confirmed,
            isConfirmed : data.transactionHash ? true : false,
            transactionHash : data.transactionHash,
            creation_timestamp : new Date(data.creation_timestamp),
            creation_date : new Date(data.creation_timestamp).toDateString(),
            address: data.address,
            nonce : data.nonce,
            link_url : data.link_url,
            ticker
		}
    })
    return res;
}

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;
        const {ln} = globalProps;
        const copy = CopyText.cashierFormDepositsTable[ln];
        
        const rows = [
            {
                id: 'amount',
                label: copy.ROW.LABEL[0],
            },
            {
                id: 'confirmed',
                label: copy.ROW.LABEL[1],
                numeric: false
            },
            {
                id: 'transactionHash',
                label: copy.ROW.LABEL[2],
                numeric: false
        
            },
            {
                id: 'creation_date',
                label: copy.ROW.LABEL[3],
                numeric: false
        
            }
        ];

        return (
            <TableHead>
                <TableRow style={{backgroundColor : '#0a031b'}}>
                {rows.map(
                    row => (
                    <StyledTableCell
                        key={row.id}
                        align={row.align ? row.align : row.numeric ? 'right' : 'left'}
                        padding={row.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === row.id ? order : false}
                        size={row.size}
                        style={{borderBottom: '1px solid #192c38', paddingLeft: 50, paddingTop: 7, paddingBottom: 7, paddingRight: 0}}
                    >
                        <Tooltip
                        title={copy.DEPOSITSTABLE.TOOLTIP.TITLE[0]}
                        placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                        enterDelay={300}
                        >
                        <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={this.createSortHandler(row.id)}
                        >
                            <Typography variant={'small-body'} color='casper' weight='bold'>
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
    const { numSelected, classes } = props;

        return (
            <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
            >
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

class DepositsTable extends React.Component {
    
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
        globalProps = props;
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { profile } = props;
        let deposits = profile.getDeposits();

        this.setState({...this.state, 
            data : fromDatabasetoTable(deposits),
            ticker : 'DAI',
            updated : true
        })
    }

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
        const { classes, ln } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page, updated } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        const copy = CopyText.cashierFormDepositsTable[ln];
        
        if(!updated){return (
            <div>
                <Typography color={'white'} variant={'body'}> {copy.DEPOSITSTABLE.TYPOGRAPHY.TEXT[0]} </Typography>
                <Typography color={'casper'} variant={'small-body'}> {copy.DEPOSITSTABLE.TYPOGRAPHY.TEXT[1]} </Typography>
            </div>
            )
        }

        return (
            <div>
                <div>
                    <Table className={classes.table} aria-labelledby="tableTitle" style={{marginTop: '10px', borderCollapse: 'separate', borderSpacing: '0 15px'}}>
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
                                    style={{padding : 0, color : 'white', backgroundColor : '#0f0e1d'}}
                                    aria-checked={isSelected}
                                    tabIndex={-1}
                                    key={n.id}
                                    selected={isSelected}
                                >
                                    <StyledTableCell  style={{width: 175, borderBottom: '1px solid #192c38', paddingLeft: 50}} align="left">
                                        <Typography variant={'small-body'} color='white'>
                                            {n.amount} {n.ticker}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell style={{width: 175, borderBottom: '1px solid #192c38', paddingLeft: 30}} align="left">
                                        {(n.isConfirmed) ? 
                                           <div styleName={withdrawStatus[n.confirmed.toLowerCase()]}>
                                                <Typography variant={'small-body'} color='white'>
                                                    {n.confirmed}
                                                </Typography>
                                            </div>
                                        : 
                                            <button styleName='deposit-button'
                                                onClick={ () => this.props.confirmDeposit(n)}
                                            >
                                                <Typography color={'white'} variant={'small-body'}>{copy.BUTTON_CONFIRMATION}</Typography>
                                            </button>
                                            
                                        }
                                        </StyledTableCell>
                                     <StyledTableCell style={{width: 175, borderBottom: '1px solid #192c38', paddingLeft: 36}} align="left">
                                        {n.transactionHash ?
                                            <a href={n.link_url} target={'_blank'}>
                                                <Typography variant={'small-body'} color='white'>
                                                    {AddressConcat(n.transactionHash)}
                                                </Typography>
                                            </a>
                                        : 
                                            'N/A'
                                        }

                                    </StyledTableCell>
                                    <StyledTableCell style={{borderBottom: '1px solid #192c38', paddingLeft: 44}} align="left">
                                        <Typography variant={'small-body'} color='white'>
                                            {n.creation_date}
                                        </Typography>
                                    </StyledTableCell>
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 49 * emptyRows }}>
                                <TableCell colSpan={6} style={{borderBottom: '1px solid #192c38'}}/>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    labelRowsPerPage = {
                        copy.TABLE.PAGE
                    }
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
            </div>
        );
    }
}



DepositsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
    return {
        deposit : state.deposit,
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))( withStyles(styles)(DepositsTable) );