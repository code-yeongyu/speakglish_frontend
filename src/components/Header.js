import React from 'react';
import './Header.css'
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = ({username, logoutFunction}) => (
    <div className="header">
        <div className="greeting">
            {username===undefined ? "":<div><span>반가워요 {username}님</span><div style={{"display": "inline"}} onClick={logoutFunction} id="logOutButton">로그아웃</div></div>}
        </div>
        <Link to="/"><span style={{color:'white'}}>SpeakGlish</span></Link>
    </div>
);
Header.propTypes = {
    username : PropTypes.string.isRequired,
    logoutFunction : PropTypes.func.isRequired
}

export default Header;