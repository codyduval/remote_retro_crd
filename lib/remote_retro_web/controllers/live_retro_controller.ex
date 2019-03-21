defmodule RemoteRetroWeb.LiveRetroController do
  use RemoteRetroWeb, :controller
  alias Phoenix.{LiveView, Token}

  alias RemoteRetro.{Retro, Participation, Idea}
  alias RemoteRetroWeb.{Presence, PresenceUtils}

  def show(conn, params) do
    user = get_session(conn, "current_user")

    soft_insert_participation_record!(user, params["id"])

    LiveView.Controller.live_render(conn, RemoteRetroWeb.LiveRetroView, session: %{user_token: "123"})
  end

  def create(conn, _params) do
    user = get_session(conn, "current_user")

    {:ok, retro} =
      %Retro{facilitator_id: user.id}
      |> Retro.changeset()
      |> Repo.insert()

    redirect(conn, to: "/live_retros/" <> retro.id)
  end

  defp soft_insert_participation_record!(user, retro_id) do
    %Participation{user_id: user.id, retro_id: retro_id}
    |> Participation.changeset()
    |> Repo.insert!(on_conflict: :nothing)
  end

  defp recent_retros_with_action_items_preloaded(user) do
    action_items_with_assignee =
      from(
        ai in Idea.action_items(),
        preload: [:assignee],
        order_by: [asc: ai.inserted_at]
      )

    query =
      from(
        r in assoc(user, :retros),
        limit: 10,
        preload: [ideas: ^action_items_with_assignee],
        order_by: [desc: r.inserted_at]
      )

    Repo.all(query)
  end
end
