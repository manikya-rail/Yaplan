class TrackChangeService

  def initialize(document, version_num)
    @original_doc = document
    @new_version = document.versions.find_by_version_number(version_num)
    @prev_version = document.versions.find_by_version_number(version_num.to_i - 1) || @new_version
  end  
    
  def diff_versions
    build
    return @document
  end

  private

  def build
    @document = {}
    @document[:id] = @original_doc.id
    @document[:title] = diff_it(prev_version_object.title, new_version_object.title)
    @document[:description] = diff_it(prev_version_object.description, new_version_object.description)
    @document[:section_texts] = []
    prev_section_texts = get_section_texts(@prev_version)
    new_section_texts = get_section_texts(@new_version)
    limiter = [prev_section_texts.size, new_section_texts.size].max

    limiter.times do |i|
      prev_section_text = prev_section_texts[i]
      new_section_text = new_section_texts[i]
      if (prev_section_text.present? && new_section_text.present?)
        section_text = section_text_diff(prev_section_text, new_section_text)
      elsif prev_section_text.present?
        section_text = create_section_hash(prev_section_text)
      elsif new_section_text.present?
        section_text = create_section_hash(new_section_text)
      else 
        break
      end
      @document[:section_texts] << section_text
    end
    @document
  end

  def section_text_diff(prev_section_text, new_section_text)
    section_text = {}
    section_text[:id] = new_section_text[:id]
    section_text[:title] = diff_it(prev_section_text[:title], new_section_text[:title])
    section_text[:content] = diff_it(prev_section_text[:content], new_section_text[:content])
    section_text
  end

  def create_section_hash(version_section_text)
    section_text = { id: version_section_text.id,title: version_section_text.title, content: version_section_text.content }
    section_text
  end

  def new_version_object
    @new_version.reify
  end

  def prev_version_object
    @prev_version.reify
  end

  def diff_it(old_content, new_content)
    TrackChange.diff(old_content || '', new_content || '')
  end

  def get_section_texts(version_object)
    section_container = get_section_container_data(version_object)
    section_texts = PaperTrail::Version
      .where(item_type: 'SectionText',item_id: section_container.collect(&:section_text_id),version_number: version_object.version_number)
      .select("object ->> 'title'  as title, object ->> 'content' as content,object ->> 'id' as id")
    section_texts
  end

  def get_section_container_data(version_object)
    document = version_object
    PaperTrail::Version
        .where("item_type = 'SectionContainer' and object ->>'document_id' = '#{document.item_id}'  and  version_number = #{version_object.version_number}")
        .select("object ->> 'section_text_id' as section_text_id, object ->> 'position' as position, id")
        .order("object ->> 'position' asc ")
  end

end