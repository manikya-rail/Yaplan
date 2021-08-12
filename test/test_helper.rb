include Devise::TestHelpers
ENV['RAILS_ENV'] ||= 'test'
require 'simplecov'
SimpleCov.start 'rails' do
  add_group 'Jobs', 'app/jobs'
  add_group 'Services', 'app/services'
end

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/rails'
require 'minitest/focus'
require_relative 'test_helper_stubs'

# Pact helpers and providers
Dir[File.dirname(__FILE__) + '/service_providers/*.rb'].each { |file| require file }

def mail_chimp_stub
  WebMock.stub_request(:post, 'https://us11.api.mailchimp.com/2.0/lists/subscribe').to_return(status: 200, body: '', headers: {})
end

def segment_stub  
  WebMock.stub_request(:post, %r{https://.*:?.*api.segment.io/v1/import}).to_return(status: 200, body: '', headers: {})
end

WebMock.disable_net_connect!(allow_localhost: true)

# To add Capybara feature tests add `gem "minitest-rails-capybara"`
# to the test group in the Gemfile and uncomment the following:
# require "minitest/rails/capybara"

# Uncomment for awesome colorful output
# require "minitest/pride"
module MyMinitestPlugin

  def before_setup
    super
    # ...code to run before all test cases
  end

  def after_teardown
    # ... code to run after all test cases
    super
  end
end

module ParseResponses
  # To simply controller response parsing
  def json_body
    JSON.parse(response.body)
  end

  def mash_body
    Hashie::Mash.new(json_body)
  end
end

module NonRailsSpecHelper
  alias context describe
  include FactoryGirl::Syntax::Methods
  include ParseResponses
  ActiveRecord::Migration.check_pending!
end

module SpecCleanUpHelper
  def before_setup
    DatabaseCleaner.start
    DatabaseCleaner.strategy = :deletion
    DatabaseCleaner.clean_with(:truncation)
    # FactoryGirl.reload
  end


  def after_teardown
    DatabaseCleaner.clean
  end
end

class MiniTest::Spec
  include SpecCleanUpHelper
  include ParseResponses
end
include NonRailsSpecHelper

require 'minitest/reporters'
Minitest::Reporters.use! Minitest::Reporters::SpecReporter.new

# For Controller Tests
class ActionController::TestCase
  # Devise's sign_in sometimes does not work on some FactoryGirl objects
  # include Devise::TestHelpers
  # Using my own instead (login_user(user))
  include TestHelpers::Stubbing
end

# For controllers tests (and maybe model classes?)
# Base class for tests
class ActiveSupport::TestCase
  ActiveRecord::Migration.check_pending!

  class << self
    alias context describe
  end
  
  before do
    load "#{Rails.root}/db/seeds.rb"
  end


  include FactoryGirl::Syntax::Methods
end
