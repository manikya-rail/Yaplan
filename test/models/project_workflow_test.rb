require 'test_helper'

class ProjectWorkflowTest < ActiveSupport::TestCase
  def project_workflow
    @project_workflow ||= ProjectWorkflow.new
  end

  def test_valid
    assert project_workflow.valid?
  end
end
