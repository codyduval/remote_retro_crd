defmodule CategoryChangeViaDragAndDrop do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  import ShorterMaps

  describe "when an idea already exists in a retro" do
    setup [:persist_idea_for_retro]

    @tag [
      idea: %Idea{category: "sad", body: "no linter"},
    ]
    test "users can drag the idea from one column to another", ~M{retro, session} do
      retro_path = "/retros/" <> retro.id
      session = visit(session, retro_path)

      assert_has(session, Query.css(".sad.ideas", text: "no linter"))
      :timer.sleep(300)
      session = add_drag_and_drop_convenience_method_to(session)
      :timer.sleep(300)

      execute_script(session,
        """
        var dragSource = document.querySelector('div[draggable="true"]');
        var dropTarget = document.querySelector('.confused.column');
        window.simulateDragDrop(dragSource, dropTarget);
        """
      )

      # assert other client sees persistence indicator
      assert_has(session, Query.css(".confused.ideas", text: "no linter (edited)"))
    end
  end

  defp add_drag_and_drop_convenience_method_to(session) do
    execute_script(session,
      """
      function simulateDragDrop(sourceNode, destinationNode) {
          var EVENT_TYPES = {
              DRAG_END: 'dragend',
              DRAG_START: 'dragstart',
              DROP: 'drop'
          }

          function createCustomEvent(type) {
              var event = new CustomEvent("CustomEvent")
              event.initCustomEvent(type, true, true, null)
              event.dataTransfer = {
                  data: {
                  },
                  setData: function(type, val) {
                      this.data[type] = val
                  },
                  getData: function(type) {
                      return this.data[type]
                  },
                  dropEffect: 'move',
                  effectAllowed:'move',
                  types: [],
                  items:{},
                  files:{},
              }
              return event
          }

          function dispatchEvent(node, type, event) {
              if (node.dispatchEvent) {
                  return node.dispatchEvent(event)
              }
              if (node.fireEvent) {
                  return node.fireEvent("on" + type, event)
              }
          }

          var event = createCustomEvent(EVENT_TYPES.DRAG_START)
          dispatchEvent(sourceNode, EVENT_TYPES.DRAG_START, event)

          var dropEvent = createCustomEvent(EVENT_TYPES.DROP)
          dropEvent.dataTransfer = event.dataTransfer
          dispatchEvent(destinationNode, EVENT_TYPES.DROP, dropEvent)

          var dragEndEvent = createCustomEvent(EVENT_TYPES.DRAG_END)
          dragEndEvent.dataTransfer = event.dataTransfer
          dispatchEvent(sourceNode, EVENT_TYPES.DRAG_END, dragEndEvent)
      }

      window.simulateDragDrop = simulateDragDrop
      """
    )
  end
end
