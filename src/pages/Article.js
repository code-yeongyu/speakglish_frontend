import React, { Component } from "react";
import { Header, WritingField } from "../components";
import { pageRedirection, signOut } from "../util";
import { URL } from "../config/Api";
import { connect } from "react-redux";
import { profileRequest, logout } from "../modules/account";

const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class Article extends Component {
    state = {
        isStarted: false,
        content: "",
        settedTime: 0,
        remainingTime: 0,
        articleId: 0,
        isMicWorking: false,
        isTimerWorking: false
    };
    componentDidMount() {}
    constructor(props) {
        super(props);

        pageRedirection(this.props, true); //로그인 되지 않은 상태일시 Home으로 이동
        fetch(URL + "/api/articles/" + this.props.match.params.articleId, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Token " + this.props.store.status.token
            }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    ...this.state,
                    content: json.content,
                    settedTime: json.timer,
                    remainingTime: json.timerLeft
                });
            });
        this.recognition = new recognition();
        this.recognition.lang = "en-US";
        this.recognition.onresult = event => {
            const length = event.results.length;
            const text = event.results[length - 1][0].transcript;
            this.setState({
                ...this.state,
                content: this.state.content + " " + text
            });
        };
        this.recognition.onend = event => {
            this.recognition.start();
        };
    }

    updateContent = evt => {
        this.setState({
            ...this.state,
            content: evt.target.value
        });
    };
    requestPatch = () => {
        fetch(
            URL + "/api/articles/" + this.props.match.params.articleId + "/",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Token " + this.props.store.status.token
                },
                body:
                    "timer=" +
                    this.state.settedTime +
                    "&timerLeft=" +
                    this.state.remainingTime +
                    "&content=" +
                    this.state.content
            }
        );
    };
    requestDelete = () => {
        fetch(
            URL + "/api/articles/" + this.props.match.params.articleId + "/",
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Token " + this.props.store.status.token
                }
            }
        );
    };
    pauseInterval = () => {
        this.setState({
            ...this.state,
            isMicWorking: false,
            isTimerWorking: false
        });
        clearInterval(window.timerInterval);
        this.recognition.onend = event => {};
        this.recognition.stop();
    };
    resumeInterval = () => {
        this.setState({
            ...this.state,
            isMicWorking: true,
            isTimerWorking: true
        });
        this.recognition.onend = event => {
            this.recognition.start();
        };
        this.recognition.start();
        this.startTimer();
    };
    pauseMic = () => {
        this.recognition.onend = event => {};
        this.recognition.stop();
        this.setState({
            isMicWorking: false
        });
    };
    resumeMic = () => {
        this.recognition.start();
        this.setState({
            isMicWorking: true
        });
    };
    removeArticle = () => {
        this.requestDelete();
        this.props.history.push("/articles");
    };
    saveArticle = () => {
        this.requestPatch();
        this.props.history.push("/articles");
    };
    addAMinute = () => {
        this.setState({
            ...this.state,
            settedTime: this.state.settedTime + 60,
            remainingTime: this.state.remainingTime + 60
        });
    };

    render() {
        return (
            <div className="write">
                <Header
                    username={this.props.store.profile.name}
                    logoutFunction={() => {
                        signOut(this.props);
                    }}
                />
                <WritingField
                    content={this.state.content}
                    settedTime={this.state.settedTime}
                    remainingTime={this.state.remainingTime}
                    isMicWorking={this.state.isMicWorking}
                    isTimerWorking={this.state.isTimerWorking}
                    onUpdateContent={this.updateContent}
                    onPauseInterval={this.pauseInterval}
                    onResumeInterval={this.resumeInterval}
                    onAddAMinute={this.addAMinute}
                    onSave={this.saveArticle}
                    onRemove={this.removeArticle}
                    onPauseMic={this.pauseMic}
                    onResumeMic={this.resumeMic}
                />
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
        profileRequest: token => {
            return dispatch(profileRequest(token));
        },
        logout: () => {
            return dispatch(logout());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Article);
