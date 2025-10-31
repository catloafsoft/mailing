# frozen_string_literal: true

require_relative 'base'

module App
  class Turbo < Base
    attr_writer :sub_dir

    def initialize(root_dir, *args)
      super('turbo', root_dir, *args)
    end

    def install_dir
      File.join(root_dir, 'apps/web')
    end

    private

    def pnpm_create!
      Dir.chdir(root_dir) do
        system_quiet('pnpm create turbo@latest --use-pnpm .')
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
