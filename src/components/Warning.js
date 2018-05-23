import React from 'react';
import "./Warning.css";

const Warning = () => (
    <div className="warningWrapper">
        <div className="Warning animated bounceIn">
            5분 미만으로는 설정하실 수 없습니다.
        </div>
    </div>
);

export default Warning;