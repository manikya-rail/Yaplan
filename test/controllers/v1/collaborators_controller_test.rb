require 'test_helper'

describe V1::CollaboratorsController do
  let(:document) { create(:document_with_sections) }
  let(:user) { document.created_by }
  let(:other_project) { create(:other_project) }
  let(:collab_user) { create(:collab_user) }
  let(:another_user) { create(:another_user) }
  before do
    sign_in user
  end
  after do
    reset_sign_in
  end

  it 'returns document collaborators on index page, with deep serialization' do
    get :index, invitations: { document_id: document.id }
    assert_response :success
  end

  it 'invite and adds a collaborator for document' do
    post :create, invitations: {  collaborators: [{ name: user.full_name, email: 'newcollab@local.tes' }], document_id: document.id }
  end

  it 'remove collaborator for document' do
    delete :destroy, invitations: { document_id: document.id }, id: collab_user.id
  end

  it 'check collaborator access' do
    ability = Ability.new(another_user)
    assert ability.cannot?(:index, collaborator: { document_id: document.id })
    assert ability.cannot?(:create, collaborator: { document_id: document.id })
    assert ability.cannot?(:destroy, collaborator: { document_id: document.id })
  end
end
