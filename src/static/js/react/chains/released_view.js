/**
 * Created by yuehaitao on 2016/10/30.
 */
import React from 'react'
import { connect } from 'react-redux'
import * as AllActions from '../actions'
import { bindActionCreators } from 'redux'
var IoLoadD = require('react-icons/lib/io/load-d');
import {Button} from 'react-bootstrap'
import { Table, search, Search} from 'reactabular';
import { compose } from 'redux';
import {Paginator, paginate} from '../helpers'
var classNames = require("classnames");

var ReleasedHistory = React.createClass({
    getInitialState: function () {
        return ({
            query: {},
            searchColumn: "all",
            pagination: {
                page: 1,
                perPage: 10
            }
        })
    },
    componentDidMount: function () {
        const {dispatch, actions} = this.props;

        dispatch(actions.fetchClusters("released"));
    },
    componentWillUnmount: function () {
        const {dispatch, actions} = this.props;
        dispatch(actions.clearClusters("released"));
    },
    searchColumnChange: function (searchColumn) {
        this.setState({
            searchColumn: searchColumn
        })
    },
    searchChange: function (query) {
        this.setState({
            query: query
        })
    },
    onSelect: function(data) {
        const {clusters} = this.props;
        var pagination = this.state.pagination;
        var page = data.selected + 1;
        var clustersLength = clusters.get("releasedClusters").valueSeq().toJS().length;
        var perPage = this.state.pagination.perPage;
        const pages = Math.ceil(
            clustersLength / perPage
        );

        this.setState({
            pagination: {
                page: Math.min(Math.max(page, 1), pages),
                perPage: pagination.perPage
            }
        });
    },
    perPageChange: function (e) {
        var pagination = this.state.pagination;
        this.setState({
            pagination: {
                page: pagination.page,
                perPage: parseInt(e.target.value)
            }
        })
    },
    render: function () {
        const {clusters} = this.props;
        const columns = [
            {
                property: 'name',
                header: {
                    label: 'Name'
                }
            },
            {
                property: 'consensus_plugin',
                header: {
                    label: 'Type'
                },
                cell: {
                    format: (plugin, {rowData}) => (
                        <span>{plugin}{rowData.consensus_mode ? <span>/{rowData.consensus_mode}</span>: <span></span>}</span>
                    )
                }
            },
            {
                property: 'size',
                header: {
                    label: 'Size'
                }
            },
            {
                property: 'host_id',
                header: {
                    label: 'Host'
                }
            },
            {
                property: 'user_id',
                header: {
                    label: 'User'
                }
            },
            {
                property: 'release_ts',
                header: {
                    label: 'Released'
                }
            },
            {
                property: 'duration',
                header: {
                    label: 'Duration'
                }
            }
        ];
        const {query, pagination} = this.state;
        const paginated = compose(
            paginate(pagination),
            search.multipleColumns({ columns, query})
        )(clusters.get("releasedClusters").valueSeq().toJS());
        const pageSizeArray = [10, 20, 30, 40, 50];
        return (
            <div className="">
                <div className="page-title">
                    <div className="title_left">
                        <h3>Released History <small>{clusters.get("fetchingClusters", false) ? <IoLoadD className="spin" size={30} /> : clusters.get("releasedClusters").valueSeq().toJS().length}</small></h3>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="x_panel">
                            <div className="x_title">
                                <h2>Released History List</h2>
                                <div className="clearfix"></div>
                            </div>
                            <div className="x_content">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="dataTables_length">
                                            <label>
                                                <select onChange={this.perPageChange} className="form-control input-sm">
                                                    {pageSizeArray.map((pageSize, i) =>
                                                        <option key={i} value={pageSize}>{pageSize}</option>
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="dataTables_filter">
                                            <label>
                                                <Search
                                                    className="input-group"
                                                    column={this.state.searchColumn}
                                                    query={this.state.query}
                                                    columns={columns}
                                                    onColumnChange={this.searchColumnChange}
                                                    onChange={this.searchChange}
                                                    rows={clusters.get("releasedClusters").valueSeq().toJS()}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <Table.Provider
                                            className="table table-striped projects"
                                            columns={columns}
                                        >
                                            <Table.Header />

                                            <Table.Body rows={paginated.rows} rowKey="id" />
                                        </Table.Provider>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-5"></div>
                                    <div className="col-sm-7">
                                        <div className="dataTables_paginate paging_simple_numbers">
                                            <Paginator
                                                pagination={pagination}
                                                pages={paginated.amount}
                                                onSelect={this.onSelect}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default connect(state => ({
    clusters: state.clusters
}), dispatch => ({
    actions: bindActionCreators(AllActions, dispatch),
    dispatch: dispatch
}))(ReleasedHistory)
