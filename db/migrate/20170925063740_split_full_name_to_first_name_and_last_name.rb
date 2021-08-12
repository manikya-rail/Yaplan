class SplitFullNameToFirstNameAndLastName < ActiveRecord::Migration[5.1]
	def change
		ActiveRecord::Base.transaction do
			if User.column_names.include?("full_name")
				User.pluck(:id,:full_name).each do |user_data|
					if user_data[1].present?
						user = User.find(user_data.first)
						split_name = user_data.last.split(' ')
						user.first_name = split_name.first
						user.last_name =  (split_name[1].present? ?  split_name[1,split_name.size].join(' ') : " ")
						user.save validate: false
					end
				end
			end
		end
	end
end
