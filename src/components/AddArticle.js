import React from 'react';
import './AddArticle.css';
import {Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

const AddArticle = () => (
    <Link to='/write'>
        <div className="AddArticle">
            <Icon name="add" size="massive" id="addIcon" color="black"/>
        </div>
    </Link>
);

export default AddArticle;