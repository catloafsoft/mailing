# frozen_string_literal: true

require_relative 'helpers/system_utils'
require_relative 'config'

class Mailing
  extend SystemUtils

  def self.build(skip: false)
    # Install pnpm dependencies and publish Cli and Core to yalc
    if skip
      puts 'Skipping build because skip-build flag is set'
      return
    end

    announce! 'Building mailing...', '🔨'

    Dir.chdir(Config::PROJECT_ROOT) do
      res = system_quiet('pnpm run build')
      raise 'pnpm run build failed' unless res
    end

    Dir.chdir(Config::CLI_ROOT) do
      system_quiet('npx yalc add')
      system_quiet('npx yalc publish')
    end

    Dir.chdir(Config::CORE_ROOT) do
      system_quiet('npx yalc add')
      system_quiet('npx yalc publish')
    end
  end
end
