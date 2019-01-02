import React, { Component } from 'react';
import Paragraph from 'react-annotated-paragraph'
import CloseButton from 'react-icons/lib/ti/times';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

import connect from "react-redux/es/connect/connect";
import { tryCreateAnnotation, createAnnotationReset } from "redux/project/Actions.js";

class AnnotatedText extends Component {
    constructor(props) {
        super(props);

        this.state = {
            annotationInput : {
                open: false,
                text: "",
                start: 0,
                end: 0,
                boxX: 0,
                boxY: 0
            }
        }

        this.createAnnotation = this.createAnnotation.bind(this);
        this.showSelectedText = this.showSelectedText.bind(this);
        this.getCaretCharacterOffsetWithin = this.getCaretCharacterOffsetWithin.bind(this);
    }

    getCaretCharacterOffsetWithin(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type !== "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }

    showSelectedText(e) {
        var text = '';
        if (window.getSelection) {
            text = window.getSelection();
        } else if (document.getSelection) {
            text = document.getSelection();
        } else if (document.selection) {
            text = document.selection.createRange().text;
        }
        const caretPos = this.getCaretCharacterOffsetWithin(e.target)
        const length_ = text.focusOffset - text.anchorOffset
        const length = length_ > 0 ? length_ : -length_;
        const start = caretPos - length
        
        if (text.toString() !== "")
            this.setState({annotationInput:
                {
                    ...this.props.annotationInput,
                    open: true,
                    start,
                    end: start + length,
                    boxX: e.nativeEvent.offsetX,
                    boxY: e.nativeEvent.offsetY
                }});

    }

    mySimpleRenderer (text, annotation) {
        let explanation = annotation.tooltip;
        let highlighted = text.substr(annotation.offset, annotation.length);
        return {
            explanation,
            highlighted
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { createAnnotationInProgress, createAnnotationHasError, createAnnotationCompleted, response, annotation } = this.props.project;
        if (!createAnnotationInProgress && !createAnnotationHasError && createAnnotationCompleted) {
            if (response && this.state.annotationInput.open) {
                this.setState({
                    annotationInput: {
                        open: false,
                        text: "",
                        start: 0,
                        end: 0,
                        boxX: 0,
                        boxY: 0
                    }
                });
                this.props.handleToUpdate(annotation);
            }
            this.props.createAnnotationReset();
        }
    }

    createAnnotation(){
        const target = {
            IRI: "https://karpuz.ml/home/project/" + this.props.project_id + "/",
            type: "text",
            start: this.state.annotationInput.start,
            end: this.state.annotationInput.end
        };
        this.props.tryCreateAnnotation(
            "https://karpuz.ml/home/project/" + this.props.project_id + "/", 
            "Referral", 
            [target], 
            {
                type: "text",
                text: this.state.annotationInput.text
            }
        );
    }

    render() {
        const { text, showAnnotations, annotations } = this.props;
        const { annotationInput } = this.state;
        
        return (
            <div onMouseUp={this.showSelectedText}>
                <div className="annotated-description">
                    {text && annotationInput.open &&
                        <div className="annotation-input" style={{ left: annotationInput.boxX, top: annotationInput.boxY + 70 }}>
                            <CloseButton onClick={(e) => this.setState({annotationInput:{ ...annotationInput, open: false }})} />
                            <Input
                                type="text"
                                value={annotationInput.text}
                                onChange={(e) => this.setState({ annotationInput: { ...annotationInput, text: e.target.value } })}
                            />
                        <Button onClick={(e) => this.createAnnotation()}>Create</Button>
                        </div>
                    }
                    {(text && showAnnotations && annotations.length !== 0)
                        ? (
                            <Paragraph
                                paragraph={{
                                    text: text,
                                    annotations: annotations.map(a => ({ offset: a.target.start, length: a.target.end - a.target.start, tooltip: a.body.text }))
                                }}
                                tooltipRenderer={this.mySimpleRenderer}
                            />
                        ) : (
                            <div>{text}</div>
                        )
                    }
                </div>
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
)(AnnotatedText);