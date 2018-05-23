import React, {Component} from 'react';
import {Timer, WritingField, Header} from '../components';
import {URL} from '../config/Api';
import './Article.css';
import {pageRedirection, signOut} from '../util';
import {connect} from 'react-redux';
import annyang from 'annyang';

export class Write extends Component{
    constructor(props){
        super(props);
        pageRedirection(props, true);
        //annyang settings
        annyang.setLanguage('en');
        annyang.addCallback('result', (heardArray)=>{
            this.setState({
                ...this.state,
                content: this.state.content+heardArray[0]
            })
        })
    }
    state = {
        isStarted: false,
        content: "",
        settedTime: 0,
        remainingTime: 0,
        articleId: 0,
        isMicWorking: false,
        isTimerWorking: false
    }
    requestPost = () => {
        fetch(URL+"/api/articles/",{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Token "+this.props.store.status.token
            },
            body: 'timer='+this.state.settedTime+"&timerLeft="+this.state.settedTime
            //the timerLeft will be the same as 'timer'
            //cuz it is the time to make article
        })
        .then(response => response.json())
        .then(json => {
            this.setState({
                ...this.state,
                articleId: json.id
            })
        });
    }
    requestPatch = () => {
        fetch(URL+"/api/articles/"+this.state.articleId+"/",{
            method:"PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Token "+this.props.store.status.token
            },
            body: "timer="+this.state.settedTime+"&timerLeft="+this.state.remainingTime+"&content="+this.state.content
        })
    }
    requestDelete = () => {
        fetch(URL+"/api/articles/"+this.state.articleId+"/",{
            method:"DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Token "+this.props.store.status.token
            }
        })
    }

    updateContent = (evt) => {
        this.setState({
            ...this.state,
            content: evt.target.value
        });
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
            if(this.state.remainingTime%60 === 0){
                this.requestPatch();
            }
            annyang.abort();
            annyang.start({ autoRestart: true, continuous: true });;
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

    TimerHandler = (time) => {
        this.setState({
            ...this.state,
            isStarted: true,
            settedTime: time,
            remainingTime: time,
            isMicWorking: true,
            isTimerWorking: true
        })
        this.requestPost();
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
            if(this.state.remainingTime%60 === 0){
                this.requestPatch();
            }
        }, 1000);
    }
    
    render (){
        return (
            <div className="write">
                <Header username={this.props.store.profile.name} logoutFunction={()=>{signOut(this.props)}}/>
                {this.state.isStarted?
                    <WritingField
                        content={this.state.content}
                        settedTime={this.state.settedTime} remainingTime={this.state.remainingTime}
                        isMicWorking={this.state.isMicWorking} isTimerWorking={this.state.isTimerWorking}
                        onUpdateContent={this.updateContent} onPauseInterval={this.pauseInterval}
                        onResumeInterval={this.resumeInterval} onAddAMinute={this.addAMinute}
                        onRemove={this.removeArticle} onSave={this.saveArticle}
                        onPauseMic={this.pauseMic} onResumeMic={this.resumeMic} 
                    />
                        : <Timer handler={this.TimerHandler}/>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        store: state
    };
};

export default connect(mapStateToProps)(Write);