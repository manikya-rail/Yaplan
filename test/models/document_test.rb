require 'test_helper'

describe Document do
  def document
    @document ||= create(:document_with_sections)
  end

  def document_order
    document.reload.section_containers.collect(&:id)
  end

  it 'should have a valid document' do
    assert document.valid?
  end

  let(:serializer) { DocumentSerializer.new(document) }
  let(:serialization) { ActiveModel::Serializer::Adapter.create(serializer, include: { section_containers: :section_text }) }

  it 'should display nicely with the children listed out' do
    JSON.parse(serialization.to_json)['document']['section_containers'][0]['section_text']['title']
      .must_equal document.section_containers[0].section_text.title
  end

  it 'should duplicate a document correctly' do
    project = create(:other_project)
    other_user = create(:another_user)
    sections_count = document.section_containers.size
    # puts document.display_doc_tree
    new_doc = document.duplicate(created_by: other_user, project: project).reload # Making sure it is valid and saved
    new_doc.created_by.must_equal other_user
    new_doc.project.must_equal project
    new_doc.section_containers.each do |container|
      container.section_text.created_by.must_equal other_user
      container.section_text.project.must_equal project
    end
    # puts document.display_doc_tree
    # puts new_doc.display_doc_tree
    document.project.wont_equal new_doc.id
    document.section_containers.wont_equal new_doc.section_containers
    document.section_texts.wont_equal new_doc.section_texts
    document.section_containers.size.must_equal sections_count
    document.section_texts.size.must_equal sections_count
    new_doc.section_containers.size.must_equal sections_count
    new_doc.section_texts.size.must_equal sections_count
  end

  describe 'it sorts things properly' do
    def container
      @container ||= create(:section_container, document: document)
    end

    def base_order
      @base_order ||= document.reload.section_containers.collect(&:id)
    end

    def new_order(n)
      new_order = @base_order.dup
      new_order.delete(@container.id)
      new_order.insert(n, @container.id)
    end

    before do
      1.upto(4) { create(:section_container, document: document) }
      container
      base_order
    end

    it 'sets an element at beginning' do
      container.after = 0
      document_order.must_equal new_order(0)
    end

    it 'sets an element in the middle' do
      container.after = document.section_containers[1].id
      document_order.must_equal new_order(2)
    end

    it 'sets an element in the end' do
      container.after = document.section_containers.last.id
      document_order.must_equal new_order(6)
    end

    it 'sets an element past the end' do
      container.set_list_position(2323)
      document_order.must_equal new_order(6)
    end
  end
end
