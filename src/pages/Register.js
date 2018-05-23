import React, {Component} from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
import {Button, Input, Icon} from 'semantic-ui-react';
import {pageRedirection} from '../util';
import {loginRequest} from '../modules/account';
import {connect} from 'react-redux';
import DjangoCSRFToken from 'django-react-csrftoken';
import axios from 'axios';
import {URL} from '../config/Api';
import {RegisterWarning} from '../components';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export class Register extends Component{
    constructor(props){
        super(props);
        pageRedirection(props);
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        console.log(e);
        fetch(URL+"/api/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'username='+this.state.name+"&email="+this.state.email+
            "&password1="+this.state.password+"&password2="+this.state.password
        }).then((response)=> response.json())
        .then(json=>{
            if(!json.account_created){
                this.showWarning();
            }
        })
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
    state = {
        name: "",
        email: "",
        password: "",
        warningVisibility: false
    }
    handleNameChange = (e) =>{
        this.setState({
            name: e.target.value
        })
    }
    handleEmailChange = (e) =>{
        this.setState({
            email: e.target.value
        })
    }
    handlePassChange = (e) =>{
        this.setState({
            password: e.target.value
        })
    }


    render () {
        return (
            <div className="register">
                <div className="left">
                    <span id="subject">회원가입</span>
                    <Link to="/login">
                        <Button id="loginButton" animated="fade">
                                <Button.Content visible>계정이 있으신가요?</Button.Content>
                            <Button.Content hidden>
                                로그인
                            </Button.Content>
                        </Button>
                    </Link>
                    <br/>
                    <form className="fields" onSubmit={this.handleSubmit}>
                        {this.state.warningVisibility ? <RegisterWarning /> : null}
                        <DjangoCSRFToken/>
                        <Input onChange={this.handleNameChange} type="text" placeholder='UserName' /><br/><br/>
                        <Input onChange={this.handleEmailChange} type="email" placeholder='이메일' /><br/><br/>
                        <Input onChange={this.handlePassChange} type="password" placeholder='비밀번호' /><br/>
                        <Button type="submit" size="huge" id="registerButton" animated="fade" color="red">
                            <Button.Content visible>가입하기</Button.Content>
                            <Button.Content hidden>
                                SpeakGlish!
                            </Button.Content>
                        </Button>
                    </form>
                </div>
                <div className="right">
                    <span><Icon name="hourglass half" /> 타이머를 설정하세요</span>
                    <span><Icon name="window maximize" /> 아무 일 이나 하세요</span>
                    <span><Icon name="exclamation" /> 혼잣말을 해보세요</span>
                    <span><Icon name="pencil" /> 당신의 컴퓨터가 받아 쓴답니다</span>
                </div>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);