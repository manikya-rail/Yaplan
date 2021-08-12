class Users::CheckAuthenticationController < ApplicationController
  before_action :authenticate_user!, only: [:am_i_authenticated]

  # Dummy controller, to support authentication tests
  def am_i_authenticated
    $stderr.puts 'In Check Authentication Controller, testing authentication'
    render json: { authenticated: true }.to_json
  end
end
