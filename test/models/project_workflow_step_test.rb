require 'test_helper'

class ProjectWorkflowStepTest < ActiveSupport::TestCase
  def project_workflow_step
    @project_workflow_step ||= ProjectWorkflowStep.new
  end

  def test_valid
    assert project_workflow_step.valid?
  end
end
