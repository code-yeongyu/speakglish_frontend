import React, { Component } from "react";
import "./Home.css";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { pageRedirection, micOff } from "../util";
import { loginRequest } from "../modules/account";
import { connect } from "react-redux";

export class Home extends Component {
    constructor(props) {
        super(props);
        micOff();
        pageRedirection(props);
    }
    render() {
        return (
            <div className="home">
                <div className="subject">
                    <span>당신의 유창성을 위해, </span>
                    <span id="red">SpeakGlish Beta</span>
                </div>
                <Link to="/register">
                    <Button color="red" id="startButton" size="massive">
                        시작하기
                    </Button>
                </Link>
                <p>
                    당신은 당신의 생각보다 영어를 잘합니다.
                    <br />
                    타이머를 지정하고, 어떤 말이든 해보세요.
                    <br />본 웹앱의 애니메이션은
                    <a href="http://anicollection.github.io/#/bouncing_entrances/bounceIn">
                        이곳
                    </a>
                    의 도움을 받았습니다.
                </p>
                <div className="introForMobile">
                    <p>
                        SpeakGlish는 PC에 최적화 되어있어요!
                        <br />
                        아이폰, 아이패드와 같은 iOS기기에서는 사용이
                        불가능하답니다..ㅠㅠ
                    </p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        store: state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(loginRequest(id, pw));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
