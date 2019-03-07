import React from "react"
import { DragSource } from "react-dnd"
import PropTypes from "prop-types"

import IdeaContentBase from "./idea_content_base"

import * as AppPropTypes from "../prop_types"

// implement contract for react-dnd drag sources
const dragSourceContract = {
  beginDrag: props => {
    return {
      idea: props.idea,
    }
  },
}

// collects props as drag events begin and end
const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

const IdeaContentConnected = props => {
  const { connectDragSource, ...rest } = props

  // connect drag source requires a native html element for applying drag-n-drop handlers
  return connectDragSource(
    <div>
      <IdeaContentBase {...rest} />
    </div>
  )
}

IdeaContentConnected.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
}

IdeaContentConnected.defaultProps = {
  assignee: null,
}

export default DragSource(
  "IDEA",
  dragSourceContract,
  collect
)(IdeaContentConnected)
