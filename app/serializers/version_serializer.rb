class VersionSerializer < ActiveModel::Serializer
	attributes :id,:created_at,:created_by,:version_number


	def created_by
		User.find_by_id(object.whodunnit).try(:full_name)
	end


end
