import React from "react"
import { DragSource } from "react-dnd"
import PropTypes from "prop-types"

import DraggableIdeaContent from "./draggable_idea_content"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const { IDEA_GENERATION, GROUPING } = STAGES

const ConditionallyDraggableIdeaContent = props => {
  const {
    stage,
    canUserEditIdeaContents,
    isTabletOrAbove,
  } = props

  // const isGrouping = stage === GROUPING
  // const isIdeaGeneration = stage === IDEA_GENERATION

  // const isIdeaDragEligible = isGrouping || (isIdeaGeneration && canUserEditIdeaContents)

  return (
    <DraggableIdeaContent {...props} />
  )
}

ConditionallyDraggableIdeaContent.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
}

ConditionallyDraggableIdeaContent.defaultProps = {
  assignee: null,
}

export default ConditionallyDraggableIdeaContent
