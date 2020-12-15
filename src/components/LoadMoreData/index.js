import React from 'react';
import { connect } from 'react-redux';
import { Button, Typography } from '../index';
import { CopyText } from '../../copy';

import "./index.css";

const LoadMoreData = ({ isLoading, onLoadMore, ln }) => {

    return (
        <div styleName="table-actions">
            <Button size="x-small" theme="action" onClick={() => onLoadMore()} disabled={isLoading}>
                <Typography color="white" variant="small-body">
                    { CopyText.gameCounter[ln].BUTTON }
                </Typography>
            </Button>
        </div>
    )
}

function mapStateToProps(state){
    return {
        ln : state.language
    };
}

export default connect(mapStateToProps)(LoadMoreData);