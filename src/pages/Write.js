import React, { Component } from "react";
import { Timer, WritingField, Header } from "../components";
import { URL } from "../config/Api";
import "./Article.css";
import { pageRedirection, signOut } from "../util";
import { connect } from "react-redux";

const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class Write extends Component {
  constructor(props) {
    super(props);
    pageRedirection(props, true);
    this.recognition = new recognition();
    this.recognition.lang = "en-US";
    this.recognition.onresult = event => {
      const length = event.results.length;
      const text = event.results[length - 1][0].transcript;
      this.setState({
        ...this.state,
        content: this.state.content +" "+ text
      });
    };
    this.recognition.onend = event => {
      this.recognition.start();
    };
    //speech api settings
  }
  state = {
    isStarted: false,
    content: "",
    settedTime: 0,
    remainingTime: 0,
    articleId: 0,
    isMicWorking: false,
    isTimerWorking: false
  };
  requestPost = () => {
    fetch(URL + "/api/articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Token " + this.props.store.status.token
      },
      body:
        "timer=" + this.state.settedTime + "&timerLeft=" + this.state.settedTime
      //the timerLeft will be the same as 'timer'
      //cuz it is the time to make article
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          ...this.state,
          articleId: json.id
        });
      });
  };
  requestPatch = () => {
    fetch(URL + "/api/articles/" + this.state.articleId + "/", {
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
    });
  };
  requestDelete = () => {
    fetch(URL + "/api/articles/" + this.state.articleId + "/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Token " + this.props.store.status.token
      }
    });
  };

  updateContent = evt => {
    this.setState({
      ...this.state,
      content: evt.target.value
    });
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
  startTimer = () => {
    window.timerInterval = setInterval(() => {
      this.setState({
        ...this.state,
        remainingTime: this.state.remainingTime - 1
      }); // decrease a second
      if (this.state.remainingTime === 0) {
        clearInterval(window.timerInterval);
        this.pauseInterval();
      }
      if (this.state.remainingTime % 60 === 0) {
        this.requestPatch(); // send patch on every minutes
      }
    }, 1000);
  };
  pauseMic = () => {
    this.recognition.onend = event => {};
    this.recognition.stop();
    this.setState({
      isMicWorking: false
    });
  };
  resumeMic = () => {
    this.recognition.stop();
    this.setState({
      isMicWorking: true
    });
  };
  addAMinute = () => {
    this.setState({
      ...this.state,
      settedTime: this.state.settedTime + 60,
      remainingTime: this.state.remainingTime + 60
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

  TimerHandler = time => {
    this.setState({
      ...this.state,
      isStarted: true,
      settedTime: time,
      remainingTime: time,
      isMicWorking: true,
      isTimerWorking: true
    });
    this.requestPost();
    this.recognition.start();
    this.startTimer();
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
        {this.state.isStarted ? (
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
            onRemove={this.removeArticle}
            onSave={this.saveArticle}
            onPauseMic={this.pauseMic}
            onResumeMic={this.resumeMic}
          />
        ) : (
          <Timer handler={this.TimerHandler} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    store: state
  };
};

export default connect(mapStateToProps)(Write);
