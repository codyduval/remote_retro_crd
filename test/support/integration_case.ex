defmodule RemoteRetro.IntegrationCase do
  use ExUnit.CaseTemplate
  use Wallaby.DSL

  alias RemoteRetro.{Repo, Retro, TestHelpers}

  import TestHelpers

  setup_all context do
    {:ok, _} = Application.ensure_all_started(:wallaby)
    :timer.sleep(100)
    Application.put_env(:wallaby, :base_url, "http://localhost:4001")
    context
  end

  using do
    quote do
      use Wallaby.DSL
      use RemoteRetro.UserRetroCase

      alias RemoteRetro.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      import RemoteRetroWeb.Router.Helpers
      import RemoteRetro.TestHelpers
      @moduletag :feature_test
    end
  end

  setup context do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)

    unless context[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Repo, {:shared, self()})
    end

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Repo, self())

    retro =
      case context[:retro_stage] do
        nil -> context[:retro]
        _ ->
          context[:retro]
          |> Retro.changeset(%{stage: context[:retro_stage]})
          |> Repo.update!
      end

    session = new_authenticated_browser_session(context[:facilitator], metadata)

    {:ok, session: session, retro: retro}
  end
end
