import React, { Component } from 'react';
import Annotation from 'components/Annotation/Annotation';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import CloseButton from 'react-icons/lib/ti/times';

import connect from "react-redux/es/connect/connect";
import { tryCreateAnnotation, createAnnotationReset } from "redux/project/Actions.js";

class AnnotatedImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            annotationImageInput: {
                open: false,
                text: "",
                x: 0,
                y: 0
            },
        }

        this.createAnnotation = this.createAnnotation.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        const { createAnnotationInProgress, createAnnotationHasError, createAnnotationCompleted, response, annotation } = this.props.project;
        if (!createAnnotationInProgress && !createAnnotationHasError && createAnnotationCompleted) {
            if (response && this.state.annotationImageInput.open) {
                this.setState({
                    annotationImageInput: {
                        open: false,
                        text: "",
                        x: 0,
                        y: 0
                    }
                });
                this.props.handleToUpdate(annotation);
            }
            this.props.createAnnotationReset();
        }
    }

    createAnnotation() {
        const target = {
            IRI: "https://karpuz.ml/home/project/" + this.props.project_id + "/",
            type: "image",
            x: this.state.annotationImageInput.x,
            y: this.state.annotationImageInput.y
        };
        this.props.tryCreateAnnotation(
            "https://karpuz.ml/home/project/" + this.props.project_id + "/", 
            "Referral", 
            [target], 
            {
                type: "text",
                text: this.state.annotationImageInput.text
            }
        );
    }

    render() {
        const { src, annotations } = this.props;
        const { annotationImageInput } = this.state;

        return (
        <div
            className="annotations-container"
            onClick={
                (e) =>
                    !annotationImageInput.open &&
                    this.setState({ annotationImageInput: { ...annotationImageInput, open: true, x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } })
            }
        >
            {
                <div>
                    {annotationImageInput.open &&
                        <div className="annotation-input" style={{ marginLeft: annotationImageInput.x, marginTop: annotationImageInput.y }}>
                            <CloseButton onClick={(e) => this.setState({ annotationImageInput: { ...annotationImageInput, open: false } })} />
                            <Input
                                type="text"
                                value={annotationImageInput.text}
                                onChange={(e) => this.setState({ annotationImageInput: { ...annotationImageInput, text: e.target.value } })}
                            />
                            <Button onClick={(e) => this.createAnnotation()}>Create</Button>
                        </div>
                    }
                    <div className="annotations">
                        {annotations.map(a => (
                            <Annotation key={Math.random()} annotation={a} annotationImageInput={annotationImageInput} />
                        ))}
                    </div>
                </div>
            }
            <img className="ch-image" alt={"Freelancer"} src={src} />
        </div>
        )
    }
}

function bindAction(dispatch) {
    return {
        tryCreateAnnotation: (url, motivation, targets, body) => dispatch(tryCreateAnnotation(url, motivation, targets, body)),
        createAnnotationReset: () => dispatch(createAnnotationReset())
    };
}

const mapStateToProps = state => ({
    project: state.project
});

export default connect(
    mapStateToProps,
    bindAction
)(AnnotatedImage);
