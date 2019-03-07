import { spy } from "sinon"

import { dragSourceSpec } from "../../web/static/js/components/category_column"

describe("DraggableIdeaContent", () => {
  describe("dragSourceSpec", () => {
    describe("#beginDrag", () => {
      let actions
      let mockDragMonitor
      let categoryColumnProps

      it("returns an object with a draggedIdea containing only an id and attributes that can be edited", () => {
        const props = {
          idea: {
            id: 666,
            category: "sad",
          }
        }
        expect(dragSourceSpec.beginDrag({ idea: {} }))

      })
    })
  })
})
