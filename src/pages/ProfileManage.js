import React, {Component} from 'react';
import {Button, Input, Form} from 'semantic-ui-react';
import './ProfileManage.css';

//add two features
/*
1. send post to change nick name
2. send post to change password
*/

export default class ProfileManage extends Component {
    render(){
        document.body.style.overflow="hidden";
        return(
            <div className="profileManageBody">
                <div className="profileManage">
                <Form>
                    <h1 className="subjects">이름 변경</h1>
                    <div className="profileInputFields">
                        <Input className="profileInput" placeholder="이름"/>
                    </div>
                    <h1 className="subjects">비밀번호 변경</h1>
                    <div className="profileInputFields">
                        <Input type="password" className="profileInput" placeholder="비밀번호"/><br/>
                        <Input type="password" className="profileInput" placeholder="비밀번호 확인"/>
                    </div>
                    <Button id="doneButton" color="green">변경사항 만들기</Button>
                </Form>
                </div>
            </div>
        );
    }
}