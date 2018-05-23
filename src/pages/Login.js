import React, {Component} from 'react';
import './Login.css';
import {Button, Input} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {loginRequest} from '../modules/account';
import {connect} from 'react-redux';
import {pageRedirection} from '../util';
//have to add a feature notify when fails authentication

export class Login extends Component {
    constructor(props){
        super(props);
        pageRedirection(props);
    }
    state = {
        emailInputValue : '',
        passInputValue : ''
    }

    handleLogin = (email, pw) => {
        return this.props.loginRequest(email, pw).then(
            () => {
                if(this.props.store.login.status === "SUCCESS") {
                // create session data
                    let loginData = {
                        isLoggedIn: true
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                    this.props.history.push('/articles');
                    return true;
                } else {
                    return false;
                }
            }
        );
    }

    updateEmailInputValue = (evt) => {
        this.setState({
          emailInputValue: evt.target.value
        });
    }
    updatePassInputValue = (evt) => {
        this.setState({
          passInputValue: evt.target.value
        });
    }
    render(){
        return(
            <div className="loginBody">
                <div className="login">
                    <span>로그인</span>
                    <Link to="/resetpass">
                        <Button id="passwordResetButton" animated color="green">
                            <Button.Content visible>비밀번호를 잊으셨나요?</Button.Content>
                            <Button.Content hidden>
                            지원하지 않습니다!
                            </Button.Content>
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button className="passwordResetButton" animated color="blue">
                            <Button.Content visible>계정이 없으신가요?</Button.Content>
                            <Button.Content hidden>
                            회원가입
                            </Button.Content>
                        </Button>
                    </Link>
                    <br/>
                    <div className="fields">
                        <Input type="email" placeholder='이메일' onChange={this.updateEmailInputValue}/><br/><br/>
                        <Input type="password" placeholder='비밀번호' onChange={this.updatePassInputValue}/><br/>
                        <Button
                            onClick={
                                () => {
                                    this.handleLogin(this.state.emailInputValue, this.state.passInputValue);
                                }}
                            size="huge" id="loginButton" animated="fade" color="red">
                            <Button.Content visible>로그인</Button.Content>
                            <Button.Content hidden>
                                SpeakGlish!
                            </Button.Content>
                        </Button>
                    </div>
                </div>
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
        loginRequest: (id, pw) => { 
            return dispatch(loginRequest(id,pw)); 
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);