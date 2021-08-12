import Ember from 'ember';
import * as _ from 'lodash';

export default Ember.Component.extend({
  cy: null,
  elements: null,
  store: Ember.inject.service('store'),
  router: Ember.inject.service('-routing'),
  currentUser: Ember.inject.service('current-user'),
  classNames: ['hundred'],
  selectedNode: null,
  assignUserActive: false,
  workflowPickerActive: false,
  setApproverActive: false,
  communicationActive: false,
  actionActive: false,
  decisionActive: false,
  documentInfoActive: false,
  isInviteMemberOpened: false,
  isAddCollaboratorOpened: false,
  invites: [],
  collaboratorCount: Ember.computed('collaborators', function() {
    let collaboratorArray = this.get('collaborators');
    let count = 0;
    collaboratorArray.forEach(function(value,key) {
      if(value.get('status') == 'accepted') {
        count = count + 1;
      }
    });
    return count;
  }),
  nonEditable: Ember.computed('project.endAt', 'projectWorkflow.locked', function() {
    return this.get('project.endAt') || this.get('projectWorkflow.locked');
  }),
  isOwner: Ember.computed('project', 'currentUser', function() {
    return parseInt(
      this.get('currentUser.user.id'), 10,
    ) === this.get('project.created_by.id');
  }),
  notification: {
    type: 0,
    msg: '',
  },
  startDate: Ember.computed('project.startAt', function() {
    return this.get('project.startAt');
  }),
  projectOwner: Ember.computed(
    'project.created_by', 'currentUser.user',
    function() {
      return this.get(
        'project.created_by.id',
      ).toString() === this.get('currentUser.user.id').toString();
    },
  ),
  completedTasks: Ember.computed('tasks', function() {
    return this.get('tasks').filter(task => task.status === 'approved');
  }),
  docTasks: Ember.computed('tasks', function() {
    return this.get('tasks').filter(task => task.type === 'Document');
  }),
  selectedStep: null,
  taskStatus(step) {
    let status;
    let collaboratorArray = this.collaborators;
    switch (step.get('nodeType')) {
      case 'decision':
        let assigned_d, assigned_email_d, approver_d, approver_email_d;
          if (step.get('task').belongsTo('assignedTo').id()) {
          assigned_d = step.get('task.assignedTo');
          assigned_email_d = assigned_d.get('email');
          if (!collaboratorArray.isAny('email', assigned_email_d)) {
            console.log("come here");
            status = 'invite-rejected';
          } else {
            console.log("else here");
            if (step.get('task.state') === 'assigned') {
              status = 'waiting-approval';
            } else if (step.get('task.state') === 'approved') {
              status = 'approved';
            } else if (step.get('task.state') === 'rejected') {
              status = 'rejected';
            } else if (
              step.get('task') && step.get('task').belongsTo('assignedTo').id() 
            ) {
              status = 'fully-configured';
            } else {
              status = 'created';
            }
          }
        } else {
          if (step.get('task.state') === 'assigned') {
            status = 'waiting-approval';
          } else if (step.get('task.state') === 'approved') {
            status = 'approved';
          } else if (step.get('task.state') === 'rejected') {
            status = 'rejected';
          } else if (
            step.get('task') && step.get('task').belongsTo('assignedTo').id()
          ) {
            status = 'fully-configured';
          } else {
            status = 'created';
          }
        }
        break;
      case 'document':
      case 'action':
        let assigned_a, assigned_email_a, approver_a, approver_email_a;
        if (step.get('task').belongsTo('assignedTo').id()) { 
          assigned_a = step.get('task.assignedTo');
          assigned_email_a = assigned_a.get('email');
          if (!collaboratorArray.isAny('email', assigned_email_a)) {
            status = 'invite-rejected';
          } else {
            if (step.get('task.state') === 'approved') {
              status = 'approved';
            } else if (step.get('task.state') === 'rejected') {
              status = 'rejected';
            } else if (step.get('state') === 'working') {
              status = 'current-task';
            } else if (
              step.get('task') && step.get('task').belongsTo('assignedTo').id() &&
              step.get('task').belongsTo('approver').id()
            ) {
              status = 'fully-configured';
            } else {
              status = 'created';
            }
          }
        } 
        if (step.get('task').belongsTo('approver').id()) {
          approver_a = step.get('task.approver');
          approver_email_a = approver_a.get('email');
          if (step.get('task.approver')) {
            if (!collaboratorArray.isAny('email', approver_email_a)) {
              status = 'invite-rejected';
            } else {
              if (step.get('task.state') === 'approved') {
                status = 'approved';
              } else if (step.get('task.state') === 'rejected') {
                status = 'rejected';
              } else if (step.get('state') === 'working') {
                status = 'current-task';
              } else if (
                step.get('task') && step.get('task').belongsTo('assignedTo').id() &&
                step.get('task').belongsTo('approver').id()
              ) {
                status = 'fully-configured';
              } else {
                status = 'created';
              }
            }
          }
        }
         if(step.get('task').belongsTo('assignedTo').id() && step.get('task').belongsTo('approver').id()) {
          if (!collaboratorArray.isAny('email', assigned_email_a)) {
            status = 'invite-rejected';
          } else if (!collaboratorArray.isAny('email', approver_email_a)) {
            status = 'invite-rejected';
          } else {
              if (step.get('task.state') === 'approved') {
                status = 'approved';
              } else if (step.get('task.state') === 'rejected') {
                status = 'rejected';
              } else if (step.get('state') === 'working') {
                status = 'current-task';
              } else if (
                step.get('task') && step.get('task').belongsTo('assignedTo').id() &&
                step.get('task').belongsTo('approver').id()
              ) {
                status = 'fully-configured';
              } else {
                status = 'created';
              }
          }
        } else {
          if (step.get('task.state') === 'approved') {
            status = 'approved';
          } else if (step.get('task.state') === 'rejected') {
            status = 'rejected';
          } else if (step.get('state') === 'working') {
            status = 'current-task';
          } else if (
            step.get('task') && step.get('task').belongsTo('assignedTo').id() &&
            step.get('task').belongsTo('approver').id()
          ) {
            status = 'fully-configured';
          } else {
            status = 'created';
          }
        }
        break;
      case 'communication':
        if (step.get('state') === 'completed') {
          status = 'approved';
        } else if (
          step.get('communications.firstObject') &&
          step.get('communications.firstObject.subject') &&
          step.get('communications.firstObject.message') &&
          step.get('communications.firstObject.communicationMode') &&
          step.get('communications.firstObject.recepientEmails.length')
        ) {
          status = 'fully-configured';
        } else {
          status = 'created';
        }
        break;
      default:
        status = step.get('state') || 'created';
    }
    return status;
  },
  didRender() {
    const self = this;
    if (this.get('projectWorkflow')) {
      this.set(
        'cy',
        cytoscape({
          container: document.getElementById('workflow'),
          layout: {
            name: 'grid',
          },
          zoom: 1,
          zoomingEnabled: false,
          pan: { x: 0, y: 0 },
          autolock: true,
          style: [{
            selector: 'node',
            style: {
              'font-size': '10pt',
            },
          }, {
            selector: '.startStop',
            style: {
              width(node) {
                return node.data('width') || 120;
              },
              height(node) {
                return node.data('height') || 120;
              },
              'text-wrap': 'wrap',
              'text-max-width': function(node) {
                return node.width() - 28;
              },
              'background-color': '#fff',
              'border-color': '#898989',
              'border-width': '1px',
              color: '#484848',
              label: 'data(text)',
              'font-family': 'Lato',
              'text-valign': 'center',
              'text-halign': 'center',
            },
          }, {
            selector: 'edge',
            style: {
              'line-color': '#747474',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#747474',
              color: 'black',
              'font-size': '10pt',
              'font-family': 'Lato',
            },
          }, {
            selector: '.yes',
            style: {
              'line-color': '#3cba54',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#3cba54',
              color: 'black',
              'font-family': 'Lato',
            },
          }, {
            selector: '.no',
            style: {
              'line-color': '#db3236',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#db3236',
              color: 'black',
              'font-family': 'Lato',
            },
          }, {
            selector: '.not-decided',
            style: {
              'line-color': '#ededf1',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#ededf1',
            },
          }, {
            selector: 'edge',
            style: {
              width: 2,
              'curve-style': 'bezier',
              label: 'data(text)',
              color: 'black',
              'font-family': 'Lato',
              'text-background-color': 'white',
              'text-background-opacity': 1,
            },
          }, {
            selector: 'edge:selected',
            style: {
              width: 2,
              'curve-style': 'bezier',
              label: 'data(text)',
              'target-arrow-shape': 'triangle',
              'line-color': 'blue',
              'target-arrow-color': 'blue',
            },
          }, {
            selector: '.document',
            style: {
              width(node) {
                return node.data('width') || 180;
              },
              height(node) {
                return node.data('height') || 60;
              },
              shape: 'rectangle',
              'font-family': 'Lato',
              'background-color': '#fff',
              'border-color': '#0064d2',
              color: '#484848',
              'text-wrap': 'wrap',
              'text-max-width': function(node) {
                return node.width() - 28;
              },
              'border-width': '1px',
              label: 'data(text)',
              'text-valign': 'center',
              'text-halign': 'center',
            },
          }, {
            selector: '.action',
            style: {
              width(node) {
                return node.data('width') || 160;
              },
              height(node) {
                return node.data('height') || 80;
              },
              shape: 'roundrectangle',
              'background-color': '#fff',
              'border-color': '#000387',
              'font-family': 'Lato',
              color: '#484848',
              'text-wrap': 'wrap',
              'text-max-width': function(node) {
                return node.width() - 28;
              },
              'border-width': '1px',
              label: 'data(text)',
              'text-valign': 'center',
              'text-halign': 'center',
            },
          }, {
            selector: '.fully-configured',
            style: {
              'background-image': function() {
                const bt = '<svg id="Group_2" data-name="Group 2" xmlns="http://www.w3.org/2000/svg" viewBox="948 528 24 24" width="12" height="12"><defs><style>.cls-1 {fill: #747474;fill-rule: evenodd;}</style></defs><path id="Path_5" data-name="Path 5" class="cls-1" d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Z" transform="translate(948 528)"/></svg>';
                return `data:image/svg+xml;base64,${window.btoa(bt)}`;
              },
              'background-position-x': function(ele) {
                if (ele.is('.decision')) {
                  return '50%';
                }
                return 10;
              },
              'background-position-y': function(ele) {
                if (ele.is('.decision')) {
                  const height = 25 * ele.width() / 100;
                  return height / 2;
                }
                return '50%';
              },
            },
          }, {
            selector: '.created',
            style: {
              'background-image': function() {
                const bt = '<svg id="Group_2" data-name="Group 2" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="948 528 24 24"><defs><style>.cls-1 {fill: #747474;fill-rule: evenodd;}</style></defs><path id="Path_4" data-name="Path 4" class="cls-1" d="M12,24A12,12,0,0,1,12,0a12.6,12.6,0,0,1,3.137.414A12,12,0,0,1,12,24ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z" transform="translate(948 528)"/></svg>';
                return `data:image/svg+xml;base64,${window.btoa(bt)}`;
              },
              'background-position-x': function(ele) {
                if (ele.is('.decision')) {
                  return '50%';
                }
                return 10;
              },
              'background-position-y': function(ele) {
                if (ele.is('.decision')) {
                  const height = 25 * ele.width() / 100;
                  return height / 2;
                }
                return '50%';
              },
              'background-clip': 'none',
            },
          }, {
            selector: '.complete,.current-task,.waiting-approval',
            style: {
              'background-image': function() {
                const bt = '<svg id="Group_3" data-name="Group 3" xmlns="http://www.w3.org/2000/svg" viewBox="948 528 24 24" width="12" height="12"><defs><style>.cls-1 {fill: #db8d3b;fill-rule: evenodd;}</style></defs><path id="Path_7" data-name="Path 7" class="cls-1" d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Z" transform="translate(948 528)"/></svg>';
                return `data:image/svg+xml;base64,${window.btoa(bt)}`;
              },
              'background-position-x': function(ele) {
                if (ele.is('.decision')) {
                  return '50%';
                }
                return 10;
              },
              'background-position-y': function(ele) {
                if (ele.is('.decision')) {
                  const height = 25 * ele.width() / 100;
                  return height / 2;
                }
                return '50%';
              },
            },
          }, {
            selector: '.approved',
            style: {
              'background-image': function() {
                const bt = '<svg id="Group_1" data-name="Group 1" xmlns="http://www.w3.org/2000/svg" viewBox="948 528 24 24" width="12" height="12"><defs><style>.cls-1 {fill: #3cba54;fill-rule: evenodd;}</style></defs><path id="Path_1" data-name="Path 1" class="cls-1" d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Z" transform="translate(948 528)"/><path id="Path_2" data-name="Path 2" class="cls-1" d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Z" transform="translate(948 528)"/></svg>';
                return `data:image/svg+xml;base64,${window.btoa(bt)}`;
              },
              'background-position-x': function(ele) {
                if (ele.is('.decision')) {
                  return '50%';
                }
                return 10;
              },
              'background-position-y': function(ele) {
                if (ele.is('.decision')) {
                  const height = 25 * ele.width() / 100;
                  return height / 2;
                }
                return '50%';
              },
            },
          }, {
            selector: '.rejected',
            style: {
              'background-image': function() {
                const bt = '<svg id="Group_4" data-name="Group 4" xmlns="http://www.w3.org/2000/svg" viewBox="948 528 24 24" width="12" height="12"><defs><style>.cls-1 {fill: #db0500;fill-rule: evenodd;}</style></defs><path id="Path_9" data-name="Path 9" class="cls-1" d="M12,24A12,12,0,1,1,24,12,12,12,0,0,1,12,24Z" transform="translate(948 528)"/></svg>';
                return `data:image/svg+xml;base64,${window.btoa(bt)}`;
              },
              'background-position-x': function(ele) {
                if (ele.is('.decision')) {
                  return '50%';
                }
                return 10;
              },
              'background-position-y': function(ele) {
                if (ele.is('.decision')) {
                  const height = 25 * ele.width() / 100;
                  return height / 2;
                }
                return '50%';
              },
            },
          }, {
            selector: '.invite-rejected',
            style: {
              'background-image': function() {
                const bt = '<svg id="Group_4" data-name="Group 4" xmlns="http://www.w3.org/2000/svg" viewBox="948 528 24 24" width="18" height="18"><defs><style>.cls-1 {fill: #db8d3b;fill-rule: evenodd;}</style></defs><path id="Path_9" data-name="Path 9" class="cls-1" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" transform="translate(948 528)"/></svg>';
                return `data:image/svg+xml;base64,${window.btoa(bt)}`;
                // return 'http://upload.wikimedia.org/wikipedia/commons/7/7b/Hawker_P._1127_-_NASA.jpg';
              },
              'background-position-x': function(ele) {
                if (ele.is('.decision')) {
                  return '50%';
                }
                return 10;
              },
              'background-position-y': function(ele) {
                if (ele.is('.decision')) {
                  const height = (25 * ele.width()) / 100;
                  return height / 2;
                }
                return '50%';
              },
            },
          }, {
            selector: '.decision',
            style: {
              width(node) {
                return node.data('width') || 60;
              },
              height(node) {
                return node.data('height') || 60;
              },
              'text-wrap': 'wrap',
              'text-max-width': function(node) {
                return node.width() - 28;
              },
              shape: 'diamond',
              'font-family': 'Lato',
              color: '#484848',
              'background-color': '#fff',
              'border-color': '#51caff',
              'border-width': '1px',
              label: 'data(text)',
              'text-valign': 'center',
              'text-halign': 'center',
            },
          }, {
            selector: '.communication',
            style: {
              width(node) {
                return node.data('width') || 120;
              },
              height(node) {
                return node.data('height') || 60;
              },
              'text-wrap': 'wrap',
              'background-color': '#fff',
              'font-family': 'Lato',
              'border-color': '#34455b',
              'border-width': '1px',
              label: 'data(text)',
              color: '#484848',
              'text-valign': 'center',
              'text-halign': 'center',
            },
          }, {
            selector: '.edgehandles-hover',
            css: {
              'background-color': '#2e353a',
            },
          }, {
            selector: '.edgehandles-source',
            css: {
              'border-width': 1,
              'border-color': '#2e353a',
            },
          }, {
            selector: '.edgehandles-target',
            css: {
              'border-width': 1,
              'border-color': '#2e353a',
            },
          }, {
            selector: '.edgehandles-preview, .edgehandles-ghost-edge',
            css: {
              'line-color': '#2e353a',
              'target-arrow-color': '#2e353a',
              'source-arrow-color': '#2e353a',
            },
          }],
          elements: [],
        }),
      );
      this.set(
        'instance',
        self.get('cy').edgeBendEditing({
          // this function specifies the positions of bend points
          bendPositionsFunction(ele) {
            return ele.data('bendPointPositions');
          },
          // whether to initilize bend points on creation of this extension automatically
          initBendPointsAutomatically: false,
          // whether the bend editing operations are undoable (requires cytoscape-undo-redo.js)
          undoable: false,
          // the size of bend shape is obtained by multipling width of edge with this parameter
          bendShapeSizeFactor: 6,
          // whether to start the plugin in the enabled state
          enabled: false,
          // title of add bend point menu item (User may need to adjust width of menu items according to length of this option)
          addBendMenuItemTitle: 'Add Bend Point',
          // title of remove bend point menu item (User may need to adjust width of menu items according to length of this option)
          removeBendMenuItemTitle: 'Remove Bend Point',
        }),
      );
      window.cy = this.get('cy');
      this.get('projectWorkflow.projectWorkflowSteps').forEach((step) => {
        const node = _.clone(step.get('node'));
        node.classes = `${node.data.id} ${step.get('nodeType')} ${this.taskStatus(step)}`;
        node.group = 'nodes';
        node.edges = null;
        node.position = {
          x: parseInt(node.position.x),
          y: parseInt(node.position.y),
        };
        self.get('cy').add(node);
      });
      this.get('projectWorkflow.projectWorkflowSteps').forEach((step) => {
        if (step.get('node') && step.get('node').edges) {
          _.forEach(step.get('node').edges, (edge) => {
            edge.group = 'edges';
            if (!_.isEmpty(edge.scratch)) {
              edge.classes = `${edge.data.id} edgebendediting-hasbendpoints cy-edge-bend-editing-highlight-bends`;
            } else {
              const sourceElement = self.get('cy').$(`.${edge.data.source}`);
              const targetElement = self.get('cy').$(`.${edge.data.target}`);
              if (sourceElement.hasClass('decision')) {
                const targetNumber = parseInt(_.slice(edge.data.target, 1, edge.data.target.length).join(''));
                if (_.includes((step.get('node').decision.YES || []), targetNumber) || _.includes((step.get('node').decision.YES || []), targetNumber.toString())) {
                  edge.classes = `${edge.data.id} yes`;
                } else if (_.includes((step.get('node').decision.NO || []), targetNumber) || _.includes((step.get('node').decision.NO || []), targetNumber.toString())) {
                  edge.classes = `${edge.data.id} no`;
                } else {
                  edge.classes = `${edge.data.id}`;
                }
              } else {
                edge.classes = `${edge.data.id}`;
              }
            }
            self.get('cy').add(edge);
            self.get('cy').trigger('click');
            self.get('cy').nodes().select();
            self.get('cy').nodes().unselect();
          });
        }
      });
      self.get('cy').ready(function(event) {
        event.cy.edges().select();
        event.cy.edges().unselect();
        event.cy.nodes().select();
        event.cy.nodes().unselect();
        event.cy.on('cxttap', '.communication', function(evt) {
          if (!self.get('projectWorkflow.locked') && self.get('isOwner')) {
            self.set('selectedNode', evt.target);
            const step = self.get('projectWorkflow.projectWorkflowSteps').find(
              s => s.get('stepId') === parseInt(evt.target.data('step_id')),
            );
            self.set('selectedStep', step);
            self.set('communicationActive', true);
          }
        });
        event.cy.on('cxttap', '.action', function(evt) {
          if (!self.get('projectWorkflow.locked') && self.get('isOwner')) {
            const step = self.get('projectWorkflow.projectWorkflowSteps').find(
              s => s.get('stepId') === parseInt(evt.target.data('step_id')),
            );
            self.set('selectedStep', step);
            self.set('actionActive', true);
          }
        });
        event.cy.on('cxttap', '.document', function(evt) {
          if (!self.get('projectWorkflow.locked') && self.get('isOwner')) {
            const step = self.get('projectWorkflow.projectWorkflowSteps').find(
              s => s.get('stepId') === parseInt(evt.target.data('step_id')),
            );
            self.set('selectedStep', step);
            self.set('documentInfoActive', true);
          }
        });
        event.cy.on('cxttap', '.decision', function(evt) {
          if (!self.get('projectWorkflow.locked') && self.get('isOwner')) {
            const step = self.get('projectWorkflow.projectWorkflowSteps').find(
              s => s.get('stepId') === parseInt(evt.target.data('step_id')),
            );
            self.set('selectedStep', step);
            self.set('decisionActive', true);
          }
        });
      });
      setTimeout(() => {
        self.get('cy').trigger('click');
        self.get('cy').nodes().select();
        self.get('cy').nodes().unselect();
      }, 500);
    }
  },
  setupMenu() {
    const self = this;
    this.set(
      'menuInstance', self.get('cy').contextMenus({
        menuItems: [{
          id: 'document',
          title: 'View Document',
          selector: '.document',
          onClickFunction(evt) {
            self.get('router').transitionTo(
              'app.documents.preview', evt.target.data('document_id'),
            );
          },
        }, {
          id: 'assignTo',
          title: 'Set assignee/approver',
          selector: '.document',
          onClickFunction(evt) {
            self.set('selectedNode', evt.target);
            self.set('assignUserActive', true);
          },
        }, {
          id: 'assignDecision',
          title: 'Set assignee',
          selector: '.decision',
          onClickFunction(evt) {
            self.set('selectedNode', evt.target);
            self.set('assignUserActive', true);
          },
        }],
        menuItemClasses: [
          'ctxt-item', // add class names to this list
        ],
        contextMenuClasses: [
          'ctxt-menu',
        ],
      }),
    );
  },
  actions: {
    assignTo(assigneeId, approverId) {
      const self = this;
      const step = _.find(
        self.get('projectWorkflow').get('projectWorkflowSteps'),
        step => step.step_id === self.get('selectedNode').data('step_id'),
      );
      this.sendAction('assignTo', step.id, assigneeId, approverId, function() {
        self.set('selectedNode', null);
        self.set('assignUserActive', false);
      });
    },
    startProject() {
      this.sendAction('startProject', this.get('model.project.id'));
    },
    showAssignWorkflow() {
      this.set('workflowPickerActive', true);
    },
    assignWorkflow(workflowTemplateId) {
      const self = this;
      self.sendAction(
        'assignWorkflow', self.get('project.id'),
        workflowTemplateId,
        function(project) {
          self.set('workflowPickerActive', false);
          self.send('showNotification', 'A new workflow template has been assigned');
          // window.location.reload();
        },
      );
    },
    toggleLock() {
      const self = this;
      const locked = self.get('projectWorkflow.locked');
      this.sendAction('toggleLock', this.get('projectWorkflow.id'), function() {
        self.send(
          'showNotification',
          `Project has been ${self.get('projectWorkflow.locked') ? 'unlocked' : 'locked'} successfully`,
        );
        self.sendAction('reloadPage');
      });
    },
    toggleInvite() {
      if (this.get('isInviteMemberOpened')) {
        this.set('invites', []);
        this.set('isInviteMemberOpened', false);
      } else {
        this.set('isInviteMemberOpened', true);
      }
    },
    invitelistofmemeber(collaborators) {
      const self = this;
      this.sendAction('invitelistofmemeber', collaborators, this.get('model.project.id'), function() {
        self.send('showNotification', 'Collaborators have been invited');
        self.send('toggleInvite');
      });
    },
    updateCommunication(communication, name) {
      const self = this;
      this.sendAction(
        'updateCommunication', communication,
        function() {
          self.set('selectedNode', null);
          self.set('selectedStep', null);
          self.send('showNotification', 'Communication was set successfuly');
          self.sendAction('reloadPage');
          self.set('communicationActive', false);
        },
      );
    },
    updateAction(step) {
      const self = this;
      this.sendAction(
        'updateAction', step,
        function() {
          self.set('actionActive', false);
          self.send('showNotification', 'Action has been updated successfully');
          self.sendAction('reloadPage');
        },
      );
    },
    updateDecision(step) {
      const self = this;
      this.sendAction(
        'updateDecision', step,
        function() {
          self.set('decisionActive', false);
          self.send('showNotification', 'Decision has been updated successfully');
          self.sendAction('reloadPage');
        },
      );
    },
    updateDocumentInfo(step) {
      const self = this;
      this.sendAction(
        'updateDocumentInfo', step,
        function() {
          self.set('documentInfoActive', false);
          self.send('showNotification', 'Task has been updated successfully');
          self.sendAction('reloadPage');
        },
      );
    },
    showNotification(message) {
      const self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function() {
        self.set('notification.type', 0);
      }, 2000);
    },
    cancelCommunication() {
      this.set('selectedStep', null);
      this.set('communicationActive', false);
    },
    cancelAction() {
      this.set('selectedStep', null);
      this.set('actionActive', false);
    },
    cancelDocumentInfo() {
      this.set('selectedStep', null);
      this.set('documentInfoActive', false);
    },
    cancelDecision() {
      this.set('selectedStep', null);
      this.set('decisionActive', false);
    },
    editWorkflow() {
      this.get('router').transitionTo(
        'app.projects.projecttab.workflow-editor',
        this.get('projectWorkflow.project.id'),
      );
    },
    saveAsTemplate() {
      const self = this;
      this.sendAction('saveAsTemplate', this.get('projectWorkflow.id'), function() {
        self.send('showNotification', 'Workflow has been saved as a template');
      });
    },
  },
});