class InviteUserMailer < ApplicationMailer
	include Apostle::Mailer
  
	def invitation_mail(from_user,to_email)
		@sender_name = from_user.full_name
		email = to_email
		@sign_up_link = "#{ENV['DOMAIN']}/#/reg/register"
		mail("welcome_to_grapple",email: email)
	end
end
