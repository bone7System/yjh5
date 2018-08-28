import React from "react";

class ViewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {

        const {editData} = this.props;

        return (
            <div>{editData.sfk}</div>
        );
    }
}

export default ViewForm;
