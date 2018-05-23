import React, {Component} from 'react';
import {Header, WritingField} from '../components';
import {pageRedirection, signOut} from '../util';
import {URL} from '../config/Api';
import {connect} from 'react-redux';
import {profileRequest, logout} from '../modules/account';
import annyang from 'annyang';

export class Article extends Component{
    state = {
        isStarted: false,
        content: "",
        settedTime: 0,
        remainingTime: 0,
        articleId: 0,
        isMicWorking: false,
        isTimerWorking: false
    }
    constructor(props){
        super(props);
        
        if(!pageRedirection(this.props, true)){//로그인 되지 않은 상태일시 Home으로 이동
            fetch(URL+"/api/articles/"+this.props.match.params.articleId, {
                method:"GET",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Token "+this.props.store.status.token
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
            annyang.setLanguage('en');
            annyang.addCallback('result', (heardArray)=>{
                this.setState({
                    ...this.state,
                    content: this.state.content+heardArray[0]
                })
                annyang.pause();
                annyang.start({ autoRestart: true, continuous: true });;
            })
            annyang.addCallback('error', function() {
                console.log("an error ocurred")
            });
        }
    }
    updateContent = (evt) => {
        this.setState({
            ...this.state,
            content: evt.target.value
        });
    }
    requestPatch = () => {
        fetch(URL+"/api/articles/"+this.props.match.params.articleId+"/",{
            method:"PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Token "+this.props.store.status.token
            },
            body: "timer="+this.state.settedTime+"&timerLeft="+this.state.remainingTime+"&content="+this.state.content
        })
    }
    requestDelete = () => {
        fetch(URL+"/api/articles/"+this.props.match.params.articleId+"/",{
            method:"DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Token "+this.props.store.status.token
            }
        })
    }
    pauseInterval = () => {
        this.setState({
            ...this.state,
            isMicWorking: false,
            isTimerWorking: false
        });
        clearInterval(window.timerInterval);
        annyang.abort();
    }
    resumeInterval = () => {
        this.setState({
            ...this.state,
            isMicWorking: true,
            isTimerWorking: true
        });
        annyang.start({ autoRestart: true, continuous: true });;
        window.timerInterval = setInterval(()=>{
            if(this.state.remainingTime-1 === 0){
                clearInterval(window.timerInterval);
                annyang.abort();
            }
            this.setState({
                ...this.state,
                remainingTime: this.state.remainingTime-1,
            });
            if(this.state.remainingTime%30 === 0){
                this.requestPatch();
                annyang.abort();
                annyang.start({ autoRestart: true, continuous: true });;
            }
        }, 1000);
    }
    pauseMic = () => {
        annyang.abort()
        this.setState({
            isMicWorking:false
        });
    }
    resumeMic = () => {
        annyang.start({ autoRestart: true, continuous: true });
        this.setState({
            isMicWorking:true
        });
    }
    addAMinute = () => {
        this.setState({
            ...this.state,
            settedTime: this.state.settedTime+60,
            remainingTime: this.state.remainingTime+60
        });
    }
    removeArticle = () => {
        this.requestDelete();
        this.props.history.push("/articles");
    }
    saveArticle = () => {
        this.requestPatch()
        this.props.history.push("/articles");
    }

    render (){
        return (
            <div className="write">
                <Header username={this.props.store.profile.name} logoutFunction={()=>{signOut(this.props)}}/>
                <WritingField
                    content={this.state.content} settedTime={this.state.settedTime}
                    remainingTime={this.state.remainingTime} isMicWorking={this.state.isMicWorking}
                    isTimerWorking={this.state.isTimerWorking} onUpdateContent={this.updateContent}
                    onPauseInterval={this.pauseInterval} onResumeInterval={this.resumeInterval}
                    onAddAMinute={this.addAMinute} onSave={this.saveArticle}
                    onRemove={this.removeArticle}
                    onPauseMic={this.pauseMic} onResumeMic={this.resumeMic}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        store: state
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        profileRequest: (token) => { 
            return dispatch(profileRequest(token)); 
        },
        logout: () => {
            return dispatch(logout());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);