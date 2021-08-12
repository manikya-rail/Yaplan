lock '3.8.1'

set :application, 'grapple.com.au'

set :repo_url, 'git@github.com:CognitiveClouds/grapple.git'

set :scm, :git

set :format, :pretty
set :log_level, :debug
set :linked_dirs, %w{frontend/node_modules frontend/bower_components}
set :puma_threads, [0, 4]
set :puma_workers, 3
set :puma_preload_app, true
set :puma_worker_timeout, nil
set :puma_init_active_record, true # Change to false when not using ActiveRecord
set :puma_preload_app, false
set :puma_prune_bundler, true

set :delayed_job_server_role, :app
set :delayed_job_args, "-n 2"

set :whenever_identifier, -> { "#{fetch(:application)}_#{fetch(:stage)}" }

set :linked_dirs, fetch(:linked_dirs, []).push('log', 'vendor/bundle', 'tmp/pids', 'tmp/sockets', '#{RAILS_ROOT}/bin', 'public', 'uploads')

namespace :deploy do
	task :precompile do
		on roles(:app) do
			within release_path do
				with rails_env: fetch(:rails_env) do
					execute :bundle, 'install --deployment'
					execute :bundle, 'exec rake assets:precompile'
					execute :bundle, 'exec rake db:migrate'
					execute :bundle, 'exec rake db:seed'
				end
			end
		end
	end

	desc 'Initial Deploy'
	task :initial do
		on roles(:app) do
			before 'deploy:restart', 'puma:start'
			invoke 'deploy'
		end
	end

	task :restart do
		on roles(:app), in: :sequence, wait: 5 do
			within release_path do
				with rails_env: fetch(:rails_env) do
					invoke 'puma:stop'
					invoke 'puma:start'
					invoke 'delayed_job:restart'
				end
			end
		end
	end

	task :copy_assets do
		on roles(:app) do
	      execute :cp, '-r', release_path.join('tmp/ember-cli/apps/frontend/assets/*'), release_path.join('public/assets/')
	    end
	end
	before :publishing, :precompile
	after :publishing, :restart
	after :precompile, :copy_assets
end

after 'deploy:updated', 'deploy:cleanup'


