import React from "react"
import { shallow } from "enzyme"
import { spy, stub } from "sinon"

import { CategoryColumn, mapStateToProps } from "../../web/static/js/components/category_column"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("CategoryColumn", () => {
  let wrapper
  const mockActions = { submitIdeaEditAsync: () => {} }
  const defaultProps = {
    currentUser: { given_name: "daniel" },
    actions: mockActions,
    votes: [],
    ideas: [],
    stage: IDEA_GENERATION,
    category: "confused",
  }

  describe("mapStateToProps", () => {
    context("when every idea passed in the ideas prop matches the column's category", () => {
      it("returns all of those ideas in the props", () => {
        const ideas = [{
          id: 1,
          body: "tests!",
          category: "happy",
        }, {
          id: 2,
          body: "winter break!",
          category: "happy",
        }]

        const resultingProps = mapStateToProps({ ideas }, { category: "happy" })
        expect(resultingProps.ideas).to.deep.equal(ideas)
      })
    })

    context("when an idea passed in the ideas prop fails to match the column's category", () => {
      it("excludes that idea from the returned array of ideas passes as props", () => {
        const ideas = [{
          id: 1,
          body: "still no word on tests",
          category: "confused",
        }, {
          id: 2,
          body: "fassssst build",
          category: "happy",
        }]

        const resultingProps = mapStateToProps({ ideas }, { category: "happy" })
        expect(resultingProps.ideas).to.deep.equal([{
          id: 2,
          body: "fassssst build",
          category: "happy",
        }])
      })
    })
  })
})
