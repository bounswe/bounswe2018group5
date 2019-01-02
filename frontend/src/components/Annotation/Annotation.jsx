import React from 'react';
import Marker from 'react-icons/lib/ti/bookmark';

const Annotation = ({ annotation, showAnnotation }) => (
  <div className="annotation" 
    style={{ left: annotation.target.x, top: annotation.target.y }}>
    <Marker />
    { annotation.display &&
        <div className="annotation-title">{ annotation.body.text }</div>
    }
  </div>
)

export default Annotation;
