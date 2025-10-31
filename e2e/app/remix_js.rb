# frozen_string_literal: true

require_relative 'base'

module App
  class RemixJs < Base
    def initialize(root_dir, *args)
      super('remix_js', root_dir, *args)
    end

    private

    def pnpm_create!
      Dir.chdir(root_dir) do
        system_quiet('pnpm create remix@latest . --template=remix --no-typescript --install')

        # pnpm add peer dependencies
        system_quiet('pnpm add next react react-dom')
      end
    end
  end
end
