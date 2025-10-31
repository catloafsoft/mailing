# frozen_string_literal: true

require_relative 'base'

module App
  class RemixTs < Base
    def initialize(root_dir, *args)
      @typescript = true
      super('remix_ts', root_dir, *args)
    end

    private

    def pnpm_create!
      Dir.chdir(root_dir) do
        # install with the "remix" template
        system_quiet('pnpm create remix@latest . --template=remix-run/remix/templates/remix --typescript --install')

        ## variation: indie-stack is a different remix template that people use
        # system_quiet("pnpm create remix@latest . --template=remix-run/indie-stack --typescript --install")

        # pnpm add peer dependencies
        system_quiet('pnpm add next react react-dom')
      end
    end
  end
end
