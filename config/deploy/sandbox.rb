server '52.187.65.115', user: 'sobin', roles: %w(app db web), my_property: :my_value
set :ssh_options, forward_agent: true, keys: %w(~/.ssh/id_rsa)
set :branch, 'development'

set :deploy_to, '/home/sobin/grapple_staging'
set :puma_bind, "unix://#{shared_path}/tmp/sockets/#{fetch(:application)}-puma.sock"
set :puma_state, "#{shared_path}/tmp/pids/puma.state"
set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"
set :puma_access_log, "#{shared_path}/log/puma.error.log"
set :puma_error_log, "#{shared_path}/log/puma.access.log"

set :linked_files, %w(config/database.yml config/secrets.yml .env.production config/puma.rb)
set :rails_env, 'production'
set :keep_releases, 3
