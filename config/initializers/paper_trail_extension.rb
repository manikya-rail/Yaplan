module PaperTrailExtension
	module ClassMethods
		
	end
	
	module InstanceMethods

		def section_containers
		  raise 'Current object is not a document object' unless self.item.is_a?(Document)
			klass = self.class
			klass.where("item_type = 'SectionContainer' and object ->>'document_id' = '#{item_id}'  and  version_number = #{version_number}")
		end

		def section_texts
			klass = self.class
			section_texts_id = self.section_containers.select("object ->> 'section_text_id' as section_text_id").collect(&:section_text_id)
			klass.where(item_type: 'SectionText',item_id: section_texts_id,version_number: version_number)
		end
		
	end
	
	def self.included(receiver)
		receiver.extend         ClassMethods
		receiver.send :include, InstanceMethods
	end
end

PaperTrail::Version.send(:include,PaperTrailExtension)