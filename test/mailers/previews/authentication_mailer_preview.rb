# Preview all emails at http://localhost:3000/rails/mailers/authentication_mailer
class AuthenticationMailerPreview < ActionMailer::Preview
  def test_user
    FactoryGirl.build(:user)
  end

  def confirmation_instructions
    AuthenticationMailer.confirmation_instructions(test_user, 'faketoken', {})
  end

  def reset_password_instructions
    AuthenticationMailer.reset_password_instructions(test_user, 'faketoken', {})
  end

  def unlock_instructions
    AuthenticationMailer.unlock_instructions(test_user, 'faketoken', {})
  end
end
