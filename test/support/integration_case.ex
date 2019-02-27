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
    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Repo, self())

    unless context[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Repo, {:shared, self()})
    end

    %{facilitator: facilitator} = context

    retro = Repo.insert!(%Retro{
      stage: context[:retro_stage] || "idea-generation",
      facilitator_id: facilitator.id
    })

    session = new_authenticated_browser_session(facilitator, metadata)

    {:ok, session: session, retro: retro}
  end
end
