import React, { Component } from "react"
import { connect } from "react-redux"
import countBy from "lodash/countBy"
import FlipMove from "react-flip-move"
import ShadowedScrollContainer from "./shadowed_scroll_container"
import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"
import STAGES from "../configs/stages"

const { VOTING, ACTION_ITEMS, CLOSED } = STAGES

const handleDragOver = event => {
  event.preventDefault()
  event.dataTransfer.dropEffect = "move"
}

const sortByVoteCountWithSecondarySortOnIdASC = (votes, ideas) => {
  const voteCountsByIdea = countBy(votes, "idea_id")
  return ideas.sort((a, b) => {
    const voteCountForIdeaA = voteCountsByIdea[a.id] || 0
    const voteCountForIdeaB = voteCountsByIdea[b.id] || 0
    if (voteCountForIdeaB === voteCountForIdeaA) { return a.id - b.id }
    return voteCountForIdeaB - voteCountForIdeaA
  })
}

export class CategoryColumn extends Component {
  constructor(props) {
    super(props)
    const { stage, category } = props
    const sortByVotes =
      (stage === ACTION_ITEMS || stage === CLOSED) && category !== "action-item"

    this.state = {
      sortByVotes,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stage === VOTING && nextProps.stage === ACTION_ITEMS) {
      const timeout = setTimeout(() => {
        this.setState({ sortByVotes: true })
        clearTimeout(timeout)
      }, 2000)
    }
  }

  handleDrop = event => {
    const ideaData = event.dataTransfer.getData("idea")
    if (!ideaData) { return }

    event.preventDefault()
    const { category, retroChannel } = this.props

    const { id, body, assignee_id: assigneeId } = JSON.parse(ideaData)

    retroChannel.push("idea_edited", {
      id,
      body,
      assigneeId,
      category,
    })
  }

  render() {
    const { handleDrop, props, state } = this
    const { category, ideas, votes } = props
    const filteredIdeas = ideas.filter(idea => idea.category === category)
    const iconHeight = 45

    let sortedIdeas
    if (state.sortByVotes) {
      sortedIdeas = sortByVoteCountWithSecondarySortOnIdASC(votes, filteredIdeas)
    } else {
      sortedIdeas = filteredIdeas.sort((a, b) => a.id - b.id)
    }

    return (
      <section className={`${category} ${styles.index} column`} onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className={` ${styles.columnHead} ui center aligned basic segment`}>
          <img src={`/images/${category}.svg`} height={iconHeight} width={iconHeight} alt={category} />
          <div className="ui computer tablet only centered padded grid">
            <p><strong>{category}</strong></p>
          </div>
        </div>
        <div className={`ui fitted divider ${styles.divider}`} />
        { !!sortedIdeas.length &&
          <ShadowedScrollContainer>
            <FlipMove
              duration={750}
              staggerDelayBy={100}
              disableAllAnimations={!state.sortByVotes}
              easing="ease"
              enterAnimation="none"
              leaveAnimation="none"
              className={`${category} ${styles.list} ideas`}
              typeName="ul"
            >
              {sortedIdeas.map(idea => <Idea {...this.props} idea={idea} key={idea.id} />)}
            </FlipMove>
          </ShadowedScrollContainer>
        }
      </section>
    )
  }
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  votes: AppPropTypes.votes.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

const mapStateToProps = ({ votes }) => ({ votes })

export default connect(
  mapStateToProps
)(CategoryColumn)
