import React from 'react';
import './Article.css'
import {Icon} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Article = ({content, articleId, settedTime, remainingTime, viewArticle}) => (
    <div className="article" onClick={()=>{viewArticle(articleId)}}>
        <div className="articleContent">
            <p>
                {content}
            </p>
        </div>
        <hr/>
        <Icon name="clock" size="large" />
        {settedTime}
        <div id="leftTime">
            {remainingTime}
        </div>
    </div>
);

Article.propTypes = {
    content: PropTypes.string,
    settedTime: PropTypes.string.isRequired,
    remainingTime: PropTypes.string.isRequired
}

export default Article;