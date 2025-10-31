# frozen_string_literal: true

require_relative 'base'

module App
  class StandaloneJs < Base
    def initialize(root_dir, *args)
      super('standalone_js', root_dir, *args)
    end

    private

    def pnpm_create!
      Dir.chdir(root_dir) do
        system_quiet('pnpm init --yes')

        # pnpm add peer dependencies
        system_quiet('pnpm add next react react-dom')
      end
    end
  end
end
