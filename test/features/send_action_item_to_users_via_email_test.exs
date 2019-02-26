defmodule SendActionItemToUsersViaEmailTest do
  alias RemoteRetro.{Emails, Idea}
  use RemoteRetro.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  import ShorterMaps

  describe "when an action-item already exists in a retro" do
    setup [:persist_idea_for_retro]

    @tag [
      idea: %Idea{category: "action-item", body: "Get better"},
      idea_author: :facilitator,
      retro_stage: "action-items",
    ]
    test "Distributing action items via email", ~M{retro, session: facilitator_session, facilitator} do
      retro_path = "/retros/" <> retro.id
      facilitator_session = visit(facilitator_session, retro_path)

      click_and_confirm(facilitator_session, "Send Action Items")

      emails = Emails.action_items_email(retro.id)
      assert emails.html_body =~ "Get better (#{facilitator.name})"

      emails |> assert_delivered_email
    end
  end
end
