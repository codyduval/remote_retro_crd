defmodule RemoteRetroWeb.LiveRetroView do
  use Phoenix.LiveView

  def render(assigns) do
    ~L"""
    <div class="">
      <div>
        <button phx-click="i_click">Click Me!</button>
      </div>
      <div>
        <%= @user_token %>
        <%= @include_js %>
        <%= @retro_uuid %>
      </div>
    </div>
    """
  end

  def mount(_session, socket) do
    {:ok,
     assign(
       socket,
       user_token: "abc",
       retro_uuid: "efg",
       include_js: true
     )}
  end

  def handle_event("i_click", _value, socket) do
    {:noreply, assign(socket, retro_uuid: "Click!")}
  end
end
