require 'test_helper'

class V1::ImagesControllerTest < ActionController::TestCase
  let(:document) { create(:document_with_sections) }
  let(:user) { document.created_by }
  let(:image) { create(:valid_image) }

  before do
    sign_in user
  end
  after do
    reset_sign_in
  end

  it 'creates new image for document' do
    assert_difference('Image.count') do
      post :create, image: { document_id: document.id, image: 'data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==' }
    end
  end

  it 'returns a image' do
    # puts "From test: Current User is #{user}"
    get :show, id: image

    json_body['image']['id'].must_equal image.id
  end
end
