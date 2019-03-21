defmodule RemoteRetroWeb.Lobby do
  use Phoenix.LiveView

  alias RemoteRetroWeb.{LiveRetroView, Presence}
  alias Phoenix.Socket.Broadcast

  def mount(%{path_params: %{"name" => name}}, socket) do
    Phoenix.PubSub.subscribe(RemoteRetro.PubSub, RemoteRetro.User)
    Phoenix.PubSub.subscribe(RemoteRetro.PubSub, "users")
    Presence.track(self(), "users", name, %{})
    {:ok, fetch(socket)}
  end

  def render(assigns), do: LiveRetroView.render("index.html", assigns)

  defp fetch(socket) do
    assign(socket, %{
      online_users: RemoteRetroWeb.Presence.list("users"),
    })
  end

  def handle_info(%Broadcast{event: "presence_diff"}, socket) do
    {:noreply, fetch(socket)}
  end

  def handle_info({RemoteRetro.User, [:user | _], _}, socket) do
    {:noreply, fetch(socket)}
  end
end
