
import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    NProgress.start();
  },
  afterModel() {
    NProgress.done();
  },
  model(params, transition) {
    return Ember.RSVP.hash({
      project: this.get('store').findRecord(
        'project', transition.params['app.projects.projecttab'].id,
      ),
      collaborators: this.store.query('collaborator', {
        project_id: transition.params['app.projects.projecttab'].id
      }),
      collaborations: this.store.query('collaboration', {
        project_id: transition.params['app.projects.projecttab'].id
      }),
      projectWorkflow: this.store.queryRecord(
        'project-workflow', {
          project_id: transition.params['app.projects.projecttab'].id
        },
      ),
      workflowTemplates: this.store.query('workflow-template', {
        published: true,
      }),
      tasks: this.store.query('task', {
        project_id: transition.params['app.projects.projecttab'].id,
      }),
    });
  },
  actions: {
    assignTo(stepId, assigneeId, approverId, callback) {
      const self = this;
      NProgress.start();
      Ember.$.ajax({
        url: `/v1/project_workflow_steps/${stepId}/set_assignee`,
        method: 'PUT',
        data: {
          project_workflow_step: {
            assigned_to_id: assigneeId,
            approver_id: approverId,
          }
        }
      })
      .done(() => {
        NProgress.done();
        callback('success');
      })
      .fail((a, b, c) => {
        NProgress.done();
        callback('failure');
      })
    },
    setApprover(stepId, userId, callback) {
      const self = this;
      NProgress.start();
      Ember.$.ajax({
        url: `/v1/project_workflow_steps/${stepId}/set_assignee`,
        method: 'PUT',
        data: {
          project_workflow_step: {
            approver_id: userId,
          }
        }
      })
      .done(() => {
        NProgress.done();
        callback('success');
      })
      .fail((a, b, c) => {
        NProgress.done();
        callback('failure');
      })
    },
    startProject(projectId) {
      const self = this;
      NProgress.start();
      $.ajax({
      type: "GET",
      url: `/v1/projects/${projectId}/start_project`,
      success: function(data) {
        NProgress.done();
        self.refresh();
        alert('Project has started and all collaborators have been notified');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        NProgress.done();
        let error_response = XMLHttpRequest.responseJSON;
        if(error_response.project) {
          alert(error_response.project.error);
          self.refresh();
        } else {
          alert("Ooops, Seems like there is a technical glitch, Please try again");
          self.refresh();
        }
      }
      });
    },
    assignWorkflow(projectId, workflowTemplateId, cb) {
      const self = this;
      NProgress.start();
      Ember.$.ajax({
        url: `/v1/projects/${projectId}/assign_workflow`,
        method: 'PUT',
        data: {
          workflow_template_id: workflowTemplateId
        }
      })
      .done(() => {
        NProgress.done();
        self.refresh();
        cb();
      });
    },
    toggleLock(workflowId, cb) {
      const self = this;
      NProgress.start();
      Ember.$.ajax({
        url: `/v1/project_workflows/${workflowId}/set_lock`,
        method: 'PUT',
        data: {},
      })
      .done(() => {
        NProgress.done();
        self.refresh();
        cb();
      })
    },
    invitelistofmemeber(collaborators, projectId, cb) {
      if (collaborators == null) {
        this.refresh();
      } else {
        NProgress.start();
        collaborators.project_id = projectId;
        let invitationss = {};
        invitationss.collaborators = [];
        invitationss.collaborators = collaborators.collaborators;
        invitationss.message = collaborators.message;
        invitationss.project_id = projectId;
        let store = this.get('store');
        let projectinvitation = store.createRecord('invitations');
        projectinvitation.setProperties({
          message: invitationss.message,
          project_id: invitationss.project_id,
          collaborators: invitationss.collaborators

        });
        const self = this;
        projectinvitation.save().then(function(saveddata) {
          cb();
          NProgress.done();
          self.refresh();
        }).catch((adapterError) => {
          NProgress.done();
          self.refresh();
        });
      }
    },
    updateCommunication(communication, cb) {
      const self = this;
      communication.save().then(function() {
        cb();
        self.refresh();
      });
    },
    updateAction(step, cb) {
      const self = this;
      NProgress.start();
      step.save().then(() => {
        NProgress.done();
        self.refresh();
        cb();
      });
    },
    updateDecision(step, cb) {
      const self = this;
      NProgress.start();
      step.save().then(() => {
        NProgress.done();
        self.refresh();
        cb();
      });
    },
    updateDocumentInfo(step, cb) {
      const self = this;
      NProgress.start();
      step.save().then(() => {
        NProgress.done();
        self.refresh();
        cb();
      });
    },
    reloadPage() {
      this.refresh();
    },
    saveAsTemplate(id, cb) {
      const self = this;
      NProgress.start();
      Ember.$.ajax({
        url: `/v1/project_workflows/${id}/save_as_template`,
        method: 'PUT',
        data: {}
      })
      .done(() => {
        NProgress.done();
        self.refresh();
        cb();
      });
    }
  }
});
