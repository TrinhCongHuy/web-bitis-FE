import React from "react";

const LikeBtnComponent = (props) => {
    const {dataHref} = props
    return (
        <div
        className="fb-like"
        data-href={dataHref}
        data-width=""
        data-layout=""
        data-action=""
        data-size=""
        data-share="true"
        ></div>
    );
};

export default LikeBtnComponent;
