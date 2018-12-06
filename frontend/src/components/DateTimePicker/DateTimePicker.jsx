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
        const { onChange, value, disabled, placeholder, before } = this.props;
        // Let's use the static moment reference in the Datetime component
        var today = Datetime.moment();
        var valid = function (current) {
            if (before) {
                return current.isBefore(today);
            } else {
                return current.isAfter(today);
            }
        };
        return (
            <div>
                <br />
                <FormControl fullWidth>
                    <Datetime
                        onChange={onChange}
                        inputProps={{
                            placeholder: placeholder,
                            disabled
                        }}
                        isValidDate={valid}
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        viewMode="days"
                        utc={true}
                        defaultValue={typeof value === "string" ? value : ""}
                />
                </FormControl>
            </div>
        );
    }
}

export default withStyles(styles)(DateTimePicker);