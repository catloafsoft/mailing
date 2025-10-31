# frozen_string_literal: true

require_relative 'base'

module App
  class StandaloneTs < Base
    def initialize(root_dir, *args)
      @typescript = true
      super('standalone_ts', root_dir, *args)
    end

    private

    def pnpm_create!
      Dir.chdir(root_dir) do
        system_quiet('pnpm init --yes')
        system_quiet('pnpm add typescript && pnpm exec tsc --init')

        # pnpm add peer dependencies
        system_quiet('pnpm add next react react-dom')
      end
    end
  end
end
