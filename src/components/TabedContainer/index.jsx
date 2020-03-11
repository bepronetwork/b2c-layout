import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import _ from 'lodash';
import { Tab, Nav } from 'react-bootstrap';
import { Typography } from 'components';
import './index.css';
class TabedContainer extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
    }

    isCurrentPath(element) {
        return this.includes(element.title.toLowerCase()); 
    }

    render = () => {

        const { items, tabTopContent} = this.props;
        const pathName = this.props.location.pathname.toLowerCase();

        let mainIndex = items.findIndex(this.isCurrentPath, pathName);
        mainIndex = mainIndex > 0 ? mainIndex : 0;

        const path = pathName.split('/');
        const parent = mainIndex > 0 ? path[path.length-2] : path[path.length-1];

        return (
            <Container className="dashboard">
                <Tab.Container id="left-tabs-example" defaultActiveKey={`item-${mainIndex}`}>
                    <Row>
                        <Col sm={3}>
                            {tabTopContent}
                            <Nav variant="pills" className="flex-column">
                                {items.map( (item, index) => {
                                    return (
                                        <Nav.Item>
                                            <Nav.Link as={Link} to={"/account/"+item.path.toLowerCase()} eventKey={`item-${index}`}>
                                                <Row>
                                                    <Col xs={2} md={2}>
                                                        {item.icon}
                                                    </Col>
                                                    <Col xs={10} md={10}>
                                                        <div styleName='text-tab'>
                                                            <Typography variant={'small-body'} color={'white'}>{item.title}</Typography>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Nav.Link>
                                        </Nav.Item>
                                    )
                                })} 
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                {items.map( (item, index) => {
                                    return (
                                        <Tab.Pane eventKey={`item-${index}`}>
                                            {item.container}
                                        </Tab.Pane>
                                    )
                                })} 
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
          </Container>
        )
    }

}



function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

export default connect(mapStateToProps)(TabedContainer);

