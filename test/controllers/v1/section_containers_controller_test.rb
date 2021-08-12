require 'test_helper'

describe V1::SectionContainersController do
  let(:user) { create(:user) }
  let(:section_container) { create(:section_container) }
  let(:document) { section_container.document }
  let(:blank_document) { create(:document, created_by: user) }
  let(:user) { document.created_by }
  # let(:document) { create(:document, created_by: user.id) }
  let(:document_with_sections) { create(:document_with_sections, created_by: user) }
  let(:section_text) { create(:section_text, created_by: user) }

  before do
    sign_in user
  end
  after do
    reset_sign_in
  end

  it 'returns nothing when the current document is empty' do
    document_with_sections # Unused document, to make sure we don't return sections from other documents
    get :index, format: :json, document_id: blank_document
    assert_response :success
    assert_not_nil assigns(:section_containers)
    json_body.must_equal ({ 'section_containers' => [] })
  end

  it 'returns the content of the current document' do
    get :index, format: :json, document_id: document_with_sections
    assert_response :success
    assert_not_nil assigns(:section_containers)
    mash_body[:section_containers].size.must_equal 2
    mash_body[:section_containers][0]['section_text']['title'].must_match /Section.* title/
  end

  it 'creates a new container with the provided text content' do
    title = 'Our title'
    content = 'Some <br> html </br> content!'
    assert_difference('SectionContainer.count') do
      post :create, format: :json, section_container: { document_id: document.id, section_text: { title: title, content: content } }
    end
    get :show, id: mash_body.section_container.id, format: :json
    mash_body.section_container.section_text[:title].must_equal title
    mash_body.section_container.section_text.content.must_equal content
    mash_body[:section_container][:section_text][:project_id].must_equal document.project.id
  end

  it 'creates a new container and reuses the provided section' do
    assert_difference('SectionContainer.count') do
      post :create, format: :json, section_container: { document_id: document.id, section_text: { id: section_text.id } }
    end
    get :show, id: mash_body.section_container.id, format: :json
    mash_body.section_container.section_text[:title].must_equal section_text.title
    mash_body.section_container.section_text.content.must_equal section_text.content
    mash_body[:section_container][:section_text][:project_id].must_equal document.project.id
  end

  it 'creates a new container and a default text section' do
    assert_difference('SectionContainer.count') do
      post :create, format: :json, section_container: { document_id: document.id }
    end
    get :show, id: mash_body[:section_container][:id], format: :json
    # Default title should be empty, so that front-end can have a title that disappears when the user clicks on it
    mash_body[:section_container][:section_text][:title].must_equal '' # SectionText::DEFAULT_TITLE
    mash_body[:section_container][:section_text][:title].must_equal ''
    mash_body[:section_container][:section_text][:project_id].must_equal document.project.id
  end

  it 'shows the details of an existing container and its embedded text section' do
    get :show, id: section_container, format: :json
    assert_response :success
    mash_body[:section_container][:section_text][:title].must_equal section_container.section_text.title
    mash_body[:section_container][:section_text][:content].must_equal section_container.section_text.content
    mash_body[:section_container][:section_text][:project_id].must_equal document.project.id
  end

  it 'removes a section container but keeps the underlying text section' do
    section_container # creating the object before the checks
    assert_difference('SectionContainer.count', -1) do
      assert_difference('SectionText.count', 0) do
        delete :destroy, id: section_container
      end
    end
  end

  describe 'Section ordering' do
    describe 'it inserts a new section at the right place' do
      it 'insert at the beginning of the document' do
        section1_id = document_with_sections.section_containers[0].id
        section2_id = document_with_sections.section_containers[1].id
        assert_difference('SectionContainer.count') do
          post :create, format: :json, section_container: { position: 1, document_id: document_with_sections.id }
        end
        created_id = mash_body[:section_container][:id]
        new_order = [created_id, section1_id, section2_id]
        document_with_sections.reload.section_containers.collect { |container| container['id'] }.must_equal new_order

        get :index, format: :json, document_id: document_with_sections
        json_body['section_containers'].collect { |container| container['id'] }.must_equal new_order
      end

      it 'insert an existing section at the specified position' do
        section1_id = document_with_sections.section_containers[0].id
        section2_id = document_with_sections.section_containers[1].id
        assert_difference('SectionContainer.count') do
          post :create, format: :json, section_container:
                          { position: 2, section_text: { id: section_text.id }, document_id: document_with_sections.id }
        end
        created_id = mash_body[:section_container][:id]
        new_order = [section1_id, created_id, section2_id]
        document_with_sections.reload.section_containers.collect { |container| container['id'] }.must_equal new_order

        get :index, format: :json, document_id: document_with_sections
        json_body['section_containers'].collect { |container| container['id'] }.must_equal new_order
      end

      it 'insert an existing section after another section' do
        section1_id = document_with_sections.section_containers[0].id
        section2_id = document_with_sections.section_containers[1].id
        assert_difference('SectionContainer.count') do
          post :create, format: :json, section_container:
                          { document_id: document_with_sections.id,
                            after: section1_id, section_text: { id: section_text.id } }
        end
        created_id = mash_body[:section_container][:id]
        new_order = [section1_id, created_id, section2_id]
        document_with_sections.reload.section_containers.collect { |container| container['id'] }.must_equal new_order

        get :index, format: :json, document_id: document_with_sections
        json_body['section_containers'].collect { |container| container['id'] }.must_equal new_order
      end

      it 'insert at the bottom when the position is not specified' do
        section1_id = document_with_sections.section_containers[0].id
        section2_id = document_with_sections.section_containers[1].id
        assert_difference('SectionContainer.count') do
          post :create, format: :json, section_container:
                          { document_id: document_with_sections.id,
                            section_text: { id: section_text.id } }
        end
        created_id = mash_body[:section_container][:id]
        new_order = [section1_id, section2_id, created_id]
        document_with_sections.reload.section_containers.collect { |container| container['id'] }.must_equal new_order

        get :index, format: :json, document_id: document_with_sections
        json_body['section_containers'].collect { |container| container['id'] }.must_equal new_order
      end
    end
    describe 'it updates the position' do
      def document
        @document ||= create(:document_with_sections, sections_count: 10)
      end

      def base_order
        @base_order ||= document.section_containers.collect(&:id)
      end

      def document_order
        document.reload.section_containers.collect(&:id)
      end

      # id of the element changed, new position
      def new_order(id, n)
        new_order = @base_order.dup
        new_order.delete(id)
        new_order.insert(n, id)
      end

      before do
        base_order
      end

      it 'goes to the top' do
        element = base_order[3]
        patch :update, format: :json, id: element, section_container: { after: 0 }
        # Returns nothing
        document_order.must_equal new_order(element, 0)
      end
      it 'goes to the middle by providing a specific position' do
        element = base_order[3]
        patch :update, format: :json, id: element, section_container: { position: 4 }
        document_order.must_equal new_order(element, 3)
      end

      it 'goes to the middle' do
        # document = create(:document_with_sections, sections_count: 10)
        element = base_order[2]
        patch :update, format: :json, id: element, section_container: { after: base_order[4] }
        document_order.must_equal new_order(element, 5)
      end
    end
  end
end
