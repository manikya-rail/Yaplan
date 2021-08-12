source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.3'
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 3.11'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'mini_racer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'
gem 'bootsnap', '>= 1.1.0', require: false
group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'railroady'
  gem 'database_cleaner'
  gem 'dotenv-rails'
  # gem 'factory_girl_rails'
  gem 'factory_girl_rails', '~> 4.9'
  # gem 'factory_bot_rails'
  gem 'minitest-rails'
  # Browser integration tests
  gem 'watir'
  gem 'minitest-focus', require: 'minitest/focus'
  #  gem 'guard-cucumber'
  #  gem 'guard-rspec'
  #  gem 'rspec-rails'
  #  gem 'debugger'
end

group :test do
  # Minitest already there by default.
  # minitest-rails seem to conflict with minitest-focus
  gem 'guard'
  gem 'guard-minitest'
  gem 'minitest-reporters'
  gem 'minitest-stub_any_instance'
  gem 'simplecov', require: false
  gem 'pact-consumer-minitest'
  # Don't know if any of the below are actually used.
  # gem 'cucumber-rails', require: false
  gem 'launchy'
  gem 'timecop'
  gem 'vcr'
  gem 'webmock'
  gem 'watir-rails'
  gem 'stripe-ruby-mock'
end

gem 'devise'

# gem 'bootstrap-sass'
gem 'jquery-rails'
gem 'devise-bootstrap-views', '~> 1.0'
gem 'wicked_pdf', '~> 1.1'

group :development do
  gem 'wkhtmltopdf-binary-edge', '~> 0.12.2.1'
  gem 'traceroute'
  gem 'rubycritic'
  gem 'rails_best_practices'
  gem 'guard'
  gem 'guard-livereload', '~> 2.4', require: false
  gem 'hirb'
  gem 'pry-rails'
  gem 'rails-erd' # to create ER-diagram
  gem 'rubocop-rails', require: false
  gem 'capistrano'
  gem 'capistrano-rvm'
  gem 'capistrano-bundler'
  gem 'capistrano3-puma'
  gem 'capistrano-sidekiq'
  gem 'capistrano-rails-console'
  gem 'capistrano-rails-tail-log'
  gem "capistrano-db-tasks", require: false
  gem 'capistrano-copy-files'
  gem 'capistrano3-delayed-job', '~> 1.0'
end

group :production do
  gem 'rails_12factor'
  gem 'sentry-raven' # Log/error collection
  gem 'puma', '~> 3.11'
end

gem 'activeadmin'
gem "active_model_serializers", require: true
gem 'apipie-rails' # API documentation
gem 'apostle-rails'

gem 'carrierwave'
gem 'rmagick'
gem 'carrierwave-base64'
gem 'fog-aws'

# gem 'rack-timeout'
gem 'rails-observers'

gem 'chargebee', '~> 2.0'
gem 'stripe'
gem 'searchkick'
gem 'minitest'
gem 'public_activity' #to track public activity 
gem 'acts-as-taggable-on', '~> 4.0'
gem 'delayed_job_active_record'
gem 'copy_carrierwave_file'
gem 'kaminari'
gem 'paper_trail'
gem 'capistrano-nvm', require: false
gem 'newrelic_rpm'
gem 'ember-cli-rails'
gem 'analytics-ruby'
gem 'devise_invitable'
# gem "ember-cli-rails-assets"

# For token authentication, there is 'simple_token_authentication' which I do not like
# Token seems to be generated once forever, which I consider to be a security issue.
# However, you could have different scopes.
# Using small new gem below instead
gem 'tiddle' # See http://adamniedzielski.github.io/blog/2015/04/04/token-authentication-with-tiddle/
gem 'cancancan' # For access permissions
# gem 'devise_invitable'
gem 'amoeba' # Deep copy, to use for templates
gem 'acts_as_list' # Ordering of the sections in a document
gem 'ransack' # Search on active record
gem 'thin' # WEbserver. We should use uniforn instead maybe
# gem 'sdoc', '~> 0.4.0', require: true
gem 'hashie' # Support easier testing via better hash handling

group :assets do
  #   gem 'bootstrap-sass', github: 'thomas-mcdonald/bootstrap-sass'
  #   gem 'sass-rails', '~> 4.0.0'
  #   gem 'coffee-rails', '~> 4.0.0'
  #   gem 'uglifier', '>= 1.3.0'
end
gem 'rails_12factor', group: [:staging, :production]
gem "letter_opener", group: :development