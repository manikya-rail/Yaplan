require 'test_helper'

class WorkflowTemplateStepTest < ActiveSupport::TestCase
  def workflow_template_step
    @workflow_template_step ||= WorkflowTemplateStep.new
  end

  def test_valid
    assert workflow_template_step.valid?
  end
end
