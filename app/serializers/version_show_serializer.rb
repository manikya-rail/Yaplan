class VersionShowSerializer < ActiveModel::Serializer
  attributes :id,:title,:description,:section_texts,:cover_page,:logo

  def id
  	version_object["id"]
  end

  def title
  	version_object["title"]
  end

  def description
  	version_object["description"]
  end

  def cover_page
  	version_object["cover_page"]
  end
	
  def logo
  	version_object["logo"]
  end

  def section_texts
    section_container = get_section_container_data
    section_texts = PaperTrail::Version
      .where(item_type: 'SectionText',item_id: section_container.collect(&:section_text_id),version_number: version_number)
      .select("object ->> 'title'  as title, object ->> 'content' as content,object ->> 'id' as id")
    section_texts
  end

private

  def get_section_container_data
    PaperTrail::Version
        .where("item_type = 'SectionContainer' and object ->>'document_id' = '#{object.item_id}'  and  version_number = #{version_number}")
        .select("object ->> 'section_text_id' as section_text_id, object ->> 'position' as position, id")
        .order("object ->> 'position' asc ")
  end

  def version_object
  	object.object
  end
  def version_number
    object.version_number
  end

end
