import React, {Component} from 'react';
import {Article, AddArticle, Header} from '../components';
import {pageRedirection, signOut, formatTime, micOff} from '../util';
import {profileRequest, logout} from '../modules/account';
import {connect} from 'react-redux';
import {URL} from '../config/Api';

export class Articles extends Component {
    state = {
        allJsonArticles: null,
        allArticles: null
    }
    componentDidMount(){
        clearInterval(window.timerInterval);
        micOff();//
        if(!pageRedirection(this.props, true)){//로그인 되지 않은 상태일시 Home으로 이동
            this.props.profileRequest(this.props.store.status.token);
        }
        this.getArticles();
    }
    getArticles = () => {
        fetch(URL+"/api/articles/", {
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
                allJsonArticles: json
            })
        });
    }
    _renderArticles = () => {
        const articles = this.state.allJsonArticles.map(article => {
            var settedTime = formatTime(article.timer)
            var remainingTime = formatTime(article.timerLeft);
            return (
                <Article content={article.content}
                        settedTime={settedTime}
                        remainingTime={remainingTime}
                        key={article.id}
                        articleId={article.id}
                        viewArticle={this.viewArticle}/>
            )
        });
        return articles;
    }

    viewArticle = (num) => {
        this.props.history.push("/article/"+num);
    }

    render() {
        return(
            <div style={{"marginTop":"4rem"}}>
                <Header username={this.props.store.profile.name} logoutFunction={()=>{signOut(this.props)}}/>
                <span className="articles">
                    {this.state.allJsonArticles? this._renderArticles():null}
                    <AddArticle/>
                </span>
            </div>
        );
    }
};


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

export default connect(mapStateToProps, mapDispatchToProps)(Articles);