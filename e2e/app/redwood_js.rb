# frozen_string_literal: true

require_relative 'base'

module App
  class RedwoodJs < Base
    def initialize(root_dir, *args)
      super('redwood_js', root_dir, *args)
    end

    private

    def pnpm_create!
      Dir.chdir(root_dir) do
        system_quiet('pnpm create redwood-app . --ts=false --no-git')

        # pnpm add peer dependencies
        system_quiet('pnpm add next react react-dom')
      end
    end

    def add_pnpm_ci_scripts!
      super

      Dir.chdir(root_dir) do
        package_json = JSON.parse(File.read('package.json'))
        package_json['resolutions'] ||= {}
        package_json['resolutions']['@types/react'] = '^17'
        package_json['resolutions']['@types/react-dom'] = '^17'
        package_json['pnpm'] ||= {}
        package_json['pnpm']['overrides'] ||= {}
        package_json['pnpm']['overrides']['@types/react'] = '^17'
        package_json['pnpm']['overrides']['@types/react-dom'] = '^17'
        File.write('package.json', JSON.pretty_generate(package_json))
      end
    end
  end
end
