import React from 'react';
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
// @material-ui/icons
// core components

const styles = {
    label: {
        cursor: "pointer",
        paddingLeft: "0",
        color: "rgba(0, 0, 0, 0.26)",
        fontSize: "14px",
        lineHeight: "1.428571429",
        fontWeight: "400",
        display: "inline-flex"
    },
};

class DateTimePicker extends React.Component{
    render(){
        const { onChange } = this.props;
        return (
            <div>
                <br />
                <FormControl fullWidth>
                    <Datetime
                        onChange={onChange}
                        inputProps={{
                            placeholder: "Project Deadline"
                        }}
                    />
                </FormControl>
            </div>
        );
    }
}

export default withStyles(styles)(DateTimePicker);