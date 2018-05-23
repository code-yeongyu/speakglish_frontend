import React from 'react';
import {TextArea, Form, Dropdown, Button} from 'semantic-ui-react';
import {formatTime} from '../util';
import PropTypes from 'prop-types';
import './WritingField.css';

var options = [
    { key: 'micToggle', text: '마이크 끄기', value: 'micToggle'},
    { key: 'intervalToggle', text: '일시 중지', value: 'intervalToggle'},
    { key: 'addAMinute', text: '1분 추가 ', value: 'addAMinute'},
    { key: 'remove', text: '삭제', value: 'remove'}
]
const WritingField = ({content, settedTime, remainingTime,
                                isMicWorking, isTimerWorking, onUpdateContent,
                                onPauseMic, onResumeMic,
                                onPauseInterval, onResumeInterval, onAddAMinute,
                                onRemove, onSave}) =>{
    var micText;
    var micToggle;
    var intervalText;
    var intervalToggle;
    if(isMicWorking){
        micText='마이크 끄기';
        micToggle=onPauseMic;
    }else{
        micText='마이크 켜기';
        micToggle=onResumeMic;
    }
    if(isTimerWorking){
        intervalText='일시 중지';
        intervalToggle=onPauseInterval;
    }else{
        micText='비활성화 됨';
        micToggle=()=>{};
        intervalText='재 시작';
        intervalToggle=onResumeInterval;
    }
    options = [//change to stupid component
        { key: 'micToggle', text: micText+' ', value: 'micToggle', onClick:micToggle},
        { key: 'intervalToggle', text:intervalText+' ', value: 'intervalToggle', onClick:intervalToggle},
        { key: 'addAMinute', text: '1분 추가 ', value: 'addAMinute', onClick:onAddAMinute},
        { key: 'remove', text: '삭제', value: 'remove', onClick:onRemove}
    ]
    
    return(
        <div className="writingField">
            <div className="menu">
            <Button.Group color='teal' className="menuButton upward" style={{'borderRadius':'0px!important'}}>
                <Button onClick={onSave} style={{'borderRadius':'0px!important'}}>저장</Button>
                <Dropdown options={options} floating button className='icon' />
            </Button.Group>
            </div>
            <Form>
                <TextArea value={content}
                onChange={onUpdateContent}
                placeholder="아무말이나 해보세요!"
                style={{height:"60%",resize: 'none'}}>
                </TextArea>
            </Form>
            <div className="timeDisplay">
                <span id="leftTime">설정 시간: {formatTime(settedTime)}</span>
                <span id="settedTime">남은 시간: {formatTime(remainingTime)}</span>
            </div>
        </div>
    )
}
WritingField.propType={
    content:PropTypes.string.isRequired,
    settedTime:PropTypes.string.isRequired,
    remainingTime:PropTypes.string.isRequired,
    isMicWorking:PropTypes.bool.isRequired,
    isTimerWorking:PropTypes.bool.isRequired,
    onUpdateContent:PropTypes.func.isRequired,
    onPauseMic:PropTypes.func.isRequired,
    onResumeMic:PropTypes.func.isRequired,
    onPauseInterval:PropTypes.func.isRequired,
    onResumeInterval:PropTypes.func.isRequired,
    onAddAMinute:PropTypes.func.isRequired,
    onRemove:PropTypes.func.isRequired,
    onSave:PropTypes.func.isRequired
}

export default WritingField;