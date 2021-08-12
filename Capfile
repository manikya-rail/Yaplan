require 'capistrano/setup'
require 'capistrano/deploy'
require 'capistrano/bundler'
require 'capistrano/rvm'
require 'capistrano/puma'
require 'capistrano/puma/nginx'
require 'capistrano/puma/workers'
require 'capistrano/rails/console'
require 'capistrano/rails_tail_log'
require 'capistrano-db-tasks'
require 'capistrano/copy_files'
require 'capistrano/delayed_job'
# require 'capistrano/nvm'


install_plugin Capistrano::Puma

Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }