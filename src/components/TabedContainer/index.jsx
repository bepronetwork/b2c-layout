import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { Tab, Nav } from 'react-bootstrap';
import { Typography } from 'components';
import { CopyText } from '../../copy';
import { getAddOn } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import classNames from "classnames";
import _ from 'lodash';
import './index.css';
class TabedContainer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            points: 0
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {

        if(!_.isEmpty(props.profile)) {
            const user = props.profile;

            this.setState({
                points : await user.getPoints()
            });
        }

    }

    isCurrentPath(element) {
        return this.includes(element.path.toLowerCase()); 
    }

    render = () => {
        const { points } = this.state;
        const { ln, items } = this.props;
        const copy = CopyText.homepage[ln];
        const pathName = this.props.location.pathname.toLowerCase();
        const filteredItems = items.filter(item => !item.disabled);
        const isValidPoints = (getAddOn().pointSystem) ? getAddOn().pointSystem.isValid : false;
        const logoPoints = (getAddOn().pointSystem) ? getAddOn().pointSystem.logo : null;
        const namePoints = (getAddOn().pointSystem) ? getAddOn().pointSystem.name : null; 

        let mainIndex = filteredItems.findIndex(this.isCurrentPath, pathName);
        mainIndex = mainIndex > 0 ? mainIndex : 0;

        const path = pathName.split('/');
        const parent = mainIndex > 0 || path.length > 2 ? path[path.length-2] : path[path.length-1];

        return (
            <Container styleName="dashboard">
                <Tab.Container id="left-tabs-example" defaultActiveKey={`item-${mainIndex}`}>
                    <Row>
                        <Col sm={0} md={0} lg={4} xl={3} styleName="container-menu">
                            {
                            isValidPoints == true
                            ?
                                <div styleName="points">
                                    <div styleName="label-points">
                                        {
                                            !_.isEmpty(logoPoints)
                                            ?
                                                <div styleName="currency-icon">
                                                    <img src={logoPoints} width={20}/>
                                                </div>
                                            :
                                                null
                                        }
                                        <span>
                                            <Typography color="white" variant={'small-body'}>{`${formatCurrency(points)} ${namePoints}`}</Typography>
                                        </span>
                                    </div>
                                </div>
                            :
                                null
                            }
                            <div styleName="title">
                                <Typography variant={'small-body'} color={'white'}>{copy.CONTAINERS.ACCOUNT.TITLE[0]}</Typography>
                            </div>
                            <Nav variant="pills" className="flex-column" styleName="menu">
                                {filteredItems.map( (item, index) => {
                                    const styles = classNames("row", {
                                        active: mainIndex === index
                                    });
                                    return (
                                        <Nav.Item>
                                            <Nav.Link as={Link} to={"/"+parent+"/"+item.path.toLowerCase()} eventKey={`item-${index}`}>
                                                <div styleName={styles}>
                                                    <div styleName="icon">
                                                        {item.icon}
                                                    </div>
                                                    <div styleName='text-tab'>
                                                        <Typography variant={'small-body'} color={mainIndex === index ? 'secondary' : 'white'}>{item.title}</Typography>
                                                    </div>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    )
                                })} 
                            </Nav>
                        </Col>
                        <Col sm={12} md={12} lg={8} xl={9}>
                            <Tab.Content>
                                {filteredItems.map( (item, index) => {
                                    return (
                                        <Tab.Pane eventKey={`item-${index}`}>
                                            <div styleName="content">
                                                {item.container}
                                            </div>
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
        profile: state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(TabedContainer);

