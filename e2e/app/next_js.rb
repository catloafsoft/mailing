# frozen_string_literal: true

require_relative 'base'

module App
  class NextJs < Base
    def initialize(root_dir, *args)
      super('next_js', root_dir, *args)
    end

    private

    def pnpm_create!
      Dir.chdir(root_dir) do
        cmd = <<-STR.split("\n").map(&:strip).join(' ')
          pnpm create next-app .
          --javascript
          --no-eslint --no-src-dir --no-experimental-app --import-alias='@/*'
        STR
        system_quiet(cmd)
      end
    end
  end
end
