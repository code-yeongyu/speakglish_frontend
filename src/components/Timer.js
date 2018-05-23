import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import {Input, Button} from 'semantic-ui-react';
import {Warning} from './';
import './Timer.css';

export default class Timer extends Component{
    constructor(props){
        super();
        this.state = {
            warningVisibility: false
        };
    }
    updateInputValue = (evt) =>{
        this.setState({
            ...this.state,
            inputValue:evt.target.value
        })
        if(evt.target.value < 0){
            evt.target.value = 0;
        }
    }
    setMinute = (time) => {
        if(time > 5) {
            this.props.handler(time*60);
        }else{
            this.showWarning();
        }
    }
    showWarning = () => {
        this.setState({
            ...this.state,
            warningVisibility: true
        })
        setTimeout(() => {
            this.setState({
                ...this.state,
                warningVisibility: false
            })
        }, 1500);
    }
    render(){
        return(
            <div className="timer">
                <FontAwesome name="clock-o" size="5x"/>
                <span>얼마나 사용하실건지 분 단위로 설정해주세요.</span>
                {this.state.warningVisibility ? <Warning /> : null}
                <Input id="timerInput" type="number" onChange={this.updateInputValue} placeholder="타이머 시간 설정" style={{width:"180px"}}/>
                <br/>
                <Button id="startButton" onClick={() => this.setMinute(this.state.inputValue)}>시작 하기</Button>
            </div>
        );
    }
}
