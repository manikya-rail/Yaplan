# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
# plans = [{:name=> "Free",
#           :amount=> 0.0,
#           :project_count=> 1
#           },
#           {:name=> "Starter",
#           :amount=> 5.0,
#           :project_count=> 3
#           },
#           {:name=> "Professional",
#           :amount=> 10.0,
#           :project_count=> 10
#           },
#           {:name=> "Team",
#           :amount=> 20.0,
#           :project_count=> -1
#           }]
# plans.each do |plan|
#   Plan.create({ name: plan[:name],
#                  amount: plan[:amount],
#                  project_count: plan[:project_count]
#               })
# end
%w(normal_user support admin).each do |role|
  Role.find_or_create_by(name: role)
end

admin_role = Role.find_by_name('admin')
normal_user_role = Role.find_by_name('normal_user')

# if Rails.env.production?
	unless User.find_by_email('admin@grapple.pm').present?
	  user = User.create(full_name: 'admin', email: 'admin@grapple.pm', password: 'admin123', role: admin_role)
	  user.confirm
	end
# end
# Seeding default user role for existing users

User.where(role: nil).each do |user|
  user.role = normal_user_role
end