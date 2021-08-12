class HelloController < ApplicationController
  before_action :authenticate_user!, except: :world

  def world
    respond_to do |format|
      format.html { render text: 'World' }
      format.json { render json: { Hello: 'world' } }
    end
  end

  def protected
    respond_to do |format|
      format.html { render text: 'Protected' }
      format.json { render json: { Hello: 'protected' } }
    end
  end

  # To test:

  # curl -v localhost:3000/hello/protected -X GET -H "Accept: application/json" -H "Content-Type: application/json"
  #  -H "X-User-email: me@test.com" -H "X-User-Token:vrhAsP1sezd-puEzykxx"
end
