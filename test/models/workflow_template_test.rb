require 'test_helper'

class WorkflowTemplateTest < ActiveSupport::TestCase
  let(:category) { create(:category) }
  let(:workflow_template) { create(:workflow_template) }

  def workflow_template
    @workflow_template ||= WorkflowTemplate.new
  end

  it 'Should create workflow template under category ' do
    workflow = category.workflow_templates.create(attributes_for(:workflow_template))
    workflow.reload
    workflow.published.must_equal true
    workflow.archived.must_equal false
  end

  it 'Should validate name field' do
    workflow_template[:name] = nil
    workflow_template.errors.messages[:name] == "can't be blank"
  end

  it 'Should not allow blank entry' do
    assert_not workflow_template.valid?
  end
end
