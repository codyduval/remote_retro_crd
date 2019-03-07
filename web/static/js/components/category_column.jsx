import React, { Component } from "react"
import { DropTarget } from "react-dnd"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import IdeaList from "./idea_list"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"
import { actions as actionCreators } from "../redux"

export class CategoryColumn extends Component {
  state = {}

  handleDrop = event => {
    const ideaData = event.dataTransfer.getData("idea")
    if (!ideaData) { return }

    this.setState({ draggedOver: false })
    event.preventDefault()
    const { category, actions } = this.props

    const idea = JSON.parse(ideaData)

    actions.submitIdeaEditAsync({ ...idea, category })
  }

  render() {
    const { handleDragOver, handleDrop, handleDragLeave, props } = this
    const { category, ideas, stage, connectDropTarget, draggedOver } = props
    const iconHeight = 45

    const dragHandlers = stage === "idea-generation" ? {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    } : {}

    return connectDropTarget(
      <section
        className={`${category} ${styles.index} ${draggedOver ? "dragged-over" : ""} column`}
        {...dragHandlers}
      >
        <div className={`${styles.columnHead} ui center aligned basic segment`}>
          <img src={`/images/${category}.svg`} height={iconHeight} width={iconHeight} alt={category} />
          <p><strong>{category}</strong></p>
        </div>
        <div className={`ui fitted divider ${styles.divider}`} />
        { !!ideas.length && <IdeaList {...props} /> }

        <span className="overlay" />
      </section>
    )
  }
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export const mapStateToProps = ({ votes, ideas, alert }, props) => {
  return {
    votes,
    ideas: ideas.filter(idea => idea.category === props.category),
    alert,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

const spec = {
  hover: (props, monitor, component) => {},
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  draggedOver: monitor.isOver({ shallow: true }),
})

const CategoryColumnAsDropTarget = DropTarget("IDEA", spec, collect)(CategoryColumn)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryColumnAsDropTarget)
