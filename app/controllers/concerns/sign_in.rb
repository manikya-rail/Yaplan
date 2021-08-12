module SignIn
  def sign_in_data(user, request)
    token = Tiddle.create_and_return_token(user, request)
    { token: token, email: user.email, user_id: user.id, full_name: user.full_name,time_zone: user.time_zone }
  end
end
