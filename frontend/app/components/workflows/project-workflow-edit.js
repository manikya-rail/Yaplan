import Ember from 'ember';
import * as _ from 'lodash';

export default Ember.Component.extend({
  cy: null,
  communicationActive: false,
  workflowInstruction: false,
  actionActive: false,
  documentActive: false,
  decisionActive: false,
  startStopActive: false,
  selectedStep: null,
  selectedNode: null,
  selectedEdge: null,
  selectedDecision: 'YES',
  newName: '',
  notification: {
    type: 0,
    msg: '',
  },
  saving: false,
  store: Ember.inject.service('store'),
  docSortProps: ['updatedAt:desc'],
  documents: Ember.computed.sort('docs', 'docSortProps'),
  isDecision: false,
  nodeStatusHeight(ele) {
    if (ele.is('.document') || ele.is('.communication') || ele.is('.action')) {
      return '45%';
    }
    return '50%';
  },
  nodeStatusWidth(ele) {
    if (ele.is('.document') || ele.is('.communication') || ele.is('.action')) {
      return '15%';
    }
    return '25%';
  },
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
  didInsertElement() {
    const self = this;
    self.set(
      'cy', cytoscape({
        container: document.getElementById('workflow-editor'),
        zoomingEnabled: false,
        layout: {
          name: 'grid',
        },
        pan: { x: 0, y: 0 },
        style: [{
          selector: 'node',
          style: {
            'font-size': '10pt',
          },
        }, {
          selector: '.startStop',
          style: {
            width(node) {
              return node.data('width') || 80;
            },
            height(node) {
              return node.data('height') || 80;
            },
            'text-wrap': 'wrap',
            'text-max-width': function(node) {
              return node.width() - 28;
            },
            'background-color': '#fff',
            'border-color': '#898989',
            'border-width': '2px',
            color: '#484848',
            label: 'data(text)',
            'font-family': 'Roboto',
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
            'font-family': 'Roboto',
          },
        }, {
          selector: '.yes',
          style: {
            'line-color': '#87aa5c',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#87aa5c',
            color: 'black',
            'font-family': 'Roboto',
          },
        }, {
          selector: '.no',
          style: {
            'line-color': '#b74138',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#b74138',
            color: 'black',
            'font-family': 'Roboto',
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
            'font-family': 'Roboto',
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
            'font-family': 'Roboto',
            'background-color': '#fff',
            'border-color': '#0064d2',
            color: '#484848',
            'text-wrap': 'wrap',
            'text-max-width': function(node) {
              return node.width();
            },
            'border-width': '2px',
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
            'border-color': '#45474d',
            'font-family': 'Roboto',
            color: '#484848',
            'text-wrap': 'wrap',
            'text-max-width': function(node) {
              return node.width();
            },
            'border-width': '2px',
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
                const height = (25 * ele.width()) / 100;
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
                const height = (25 * ele.width()) / 100;
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
                const height = (25 * ele.width()) / 100;
                return height / 2;
              }
              return '50%';
            },
          },
        }, {
          selector: '.approved',
          style: {
            'background-image': function() {
              const bt = '<svg id="Group_1" data-name="Group 1" xmlns="http://www.w3.org/2000/svg" viewBox="948 528 24 24" width="12" height="12"><defs><style>.cls-1 {fill: #87aa5c;fill-rule: evenodd;}</style></defs><path id="Path_1" data-name="Path 1" class="cls-1" d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Z" transform="translate(948 528)"/><path id="Path_2" data-name="Path 2" class="cls-1" d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Z" transform="translate(948 528)"/></svg>';
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
                const height = (25 * ele.width()) / 100;
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
                const height = (25 * ele.width()) / 100;
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
              return node.data('width') || 80;
            },
            height(node) {
              return node.data('height') || 80;
            },
            'text-wrap': 'wrap',
            'text-max-width': function(node) {
              return node.width();
            },
            shape: 'diamond',
            'font-family': 'Roboto',
            color: '#484848',
            'background-color': '#fff',
            'border-color': '#51caff',
            'border-width': '2px',
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
            'text-max-width': function(node) {
              return node.width();
            },
            'background-color': '#fff',
            'font-family': 'Roboto',
            'border-color': '#34455b',
            'border-width': '2px',
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
            'border-width': 2,
            'border-color': '#2e353a',
          },
        }, {
          selector: '.edgehandles-target',
          css: {
            'border-width': 2,
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
    this.send('redrawGraph');
    self.get('cy').ready(function(event) {
      event.cy.edges().select();
      event.cy.edges().unselect();
      event.cy.nodes().select();
      event.cy.nodes().unselect();
      event.cy.on('cxttap', '.communication', function(evt) {
        self.set('selectedNode', evt.target);
        const step = self.get('projectWorkflow.projectWorkflowSteps').find(
          s => parseInt(s.get('stepId'), 10) === parseInt(evt.target.data('step_id'), 10),
        );
        if (!step.get('communications.firstObject')) {
          step.get('communications').createRecord();
        }
        self.set('selectedStep', step);
        self.set('communicationActive', true);
      });
      event.cy.on('cxttap', '.action', function(evt) {
        self.set('selectedNode', evt.target);
        const step = self.get('projectWorkflow.projectWorkflowSteps').find(
          s => parseInt(s.get('stepId'), 10) === parseInt(evt.target.data('step_id'), 10),
        );
        self.set('selectedStep', step);
        self.set('actionActive', true);
      });
      event.cy.on('cxttap', '.document', function(evt) {
        self.set('selectedNode', evt.target);
        const step = self.get('projectWorkflow.projectWorkflowSteps').find(
          s => parseInt(s.get('stepId'), 10) === parseInt(evt.target.data('step_id'), 10),
        );
        self.set('selectedDocument', step.get('task'));
        self.set('selectedStep', step);
        self.set('documentInfoActive', true);
      });
      event.cy.on('cxttap', '.decision', function(evt) {
        self.set('selectedNode', evt.target);
        const step = self.get('projectWorkflow.projectWorkflowSteps').find(
          s => parseInt(s.get('stepId'), 10) === parseInt(evt.target.data('step_id'), 10),
        );
        self.set('selectedStep', step);
        self.set('decisionActive', true);
      });
      event.cy.on('cxttap', '.startStop', function(evt) {
        self.set('selectedNode', evt.target);
        const step = self.get('projectWorkflow.projectWorkflowSteps').find(
          s => parseInt(s.get('stepId'), 10) === parseInt(evt.target.data('step_id'), 10),
        );
        self.set('selectedStep', step);
        self.set('startStopActive', true);
      });
      event.cy.on('change-name', 'node', function(evt) {
        // const step = self.get('projectWorkflow.projectWorkflowSteps').find(
        //   s => s.get('stepId') === parseInt(evt.target.data('step_id')),
        // );
        // self.set('selectedStep', step);
        // self.set('decisionActive', true);
        evt.target.data({ text: self.get('newName') });
        self.set('newName', '');
      });
    });
    self.get('cy').snapToGrid({ drawGrid: false });
    const defaults = {
      preview: false, // whether to show added edges preview before releasing selection
      enabled: true, // whether to start the plugin in the enabled state
      toggleOffOnLeave: true,
      handleColor: '#2e353a',
      handleNodes(node) {
        return !node.is('.communication');
      },
      // handleColor: '#2e353a',
      loopAllowed() { return false; },
      nodeLoopOffset: -50, // offset for edgeType: 'node' loops
      edgeParams(sourceNode, targetNode) {
        let maxNode = _.max(
          self.cy.edges().toArray().map(
            e => parseInt(
              _.slice(e.data('id'), 1, e.data('id').length).join(''),
              10,
            ),
          ),
        ) || 0;

        maxNode += 1;
        return {
          group: 'edges',
          data: {
            id: `e${maxNode}`,
            source: sourceNode.data('id'),
            target: targetNode.data('id'),
            text: '',
          },
          classes: `e${maxNode}`,
        };
      },
      complete(sourceNode, targetNodes, addedEntities) {
        if (sourceNode.hasClass('decision')) {
          self.set('isDecision', true);
        } else {
          self.set('isDecision', false);
        }
        self.set('selectedElement', addedEntities[0].data('id'));
        self.set('labelToEdit', '');
        self.set('labelEditorActive', true);
        self.$('#workflow-label').val('');
      },
    };
    self.get('cy').edgehandles(defaults);
    this.set(
      'instance',
      self.get('cy').edgeBendEditing({
        bendPositionsFunction(ele) {
          return ele.data('bendPointPositions');
        },
        initBendPointsAutomatically: false,
        undoable: false,
        bendShapeSizeFactor: 6,
        enabled: true,
        addBendMenuItemTitle: 'Add Bend Point',
        removeBendMenuItemTitle: 'Remove Bend Point',
      }),
    );
    Ember.$('.fa-times,.fa-bars,.fa-caret-right,.fa-caret-left').on('click', function() {
      setTimeout(() => self.get('cy').resize(), 600);
    });
    this.set(
      'menuInstance', this.cy.contextMenus({
        menuItems: [{
          id: 'remove-edge',
          title: 'Remove',
          selector: 'edge',
          onClickFunction(evt) {
            self.get('cy').$(`.${evt.target.data('id')}`).remove();
          },
        }, {
          id: 'label',
          title: 'Change Name',
          selector: 'edge',
          onClickFunction(evt) {
            self.set('selectedElement', evt.target.data('id'));
            if (
              evt.target.data('source') &&
              self.cy.$(`.${evt.target.data('source')}`).hasClass('decision')
            ) {
              self.set('isDecision', true);
              if (evt.target.source().data('decision')) {
                const noList = _.map(
                  evt.target.source().data('decision').NO || [],
                  id => parseInt(id),
                );
                if (_.includes(noList, parseInt(evt.target.target().data('step_id')))) {
                  self.set('selectedDecision', 'NO');
                } else {
                  self.set('selectedDecision', 'YES');
                }
              }
            } else {
              self.set('isDecision', false);
            }
            self.set('labelToEdit', evt.target.data('text') || '');
            self.set('labelEditorActive', true);
            self.$('#workflow-label').val(evt.target.data('text') || '');
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
    setTimeout(() => {
      // self.cy.trigger('click');
      self.get('cy').nodeResize({
        padding: 5, // spacing between node and grapples/rectangle
        undoable: true, // and if cy.undoRedo exists
        grappleSize: 8, // size of square dots
        grappleColor: 'green', // color of grapples
        inactiveGrappleStroke: 'inside 1px blue',
        boundingRectangle: true, // enable/disable bounding rectangle
        boundingRectangleLineDash: [4, 8], // line dash of bounding rectangle
        boundingRectangleLineColor: 'red',
        boundingRectangleLineWidth: 1.5,
        zIndex: 999,
        setWidth(node, width) {
          node.css('width', width);
        },
        setHeight(node, height) {
          node.css('height', height);
        },
        isFixedAspectRatioResizeMode(node) { return true; }, // with only 4 active grapples (at corners)
      });
      self.sendAction('setCy', this.get('cy'));
      self.sendAction('setCyJson', this.get('cy').json());
      // _.times(self.get('steps').length, () => self.$('#add-document').click());
    }, 50);
    self.cy.nodes().select();
    self.cy.nodes().unselect();
    self.cy.edges().select();
    self.cy.edges().unselect();
  },
  actions: {
    addComponent(componentName) {
      const self = this;
      let maxNode = _.max(
        this.get(
          'projectWorkflow.projectWorkflowSteps',
        ).map(s => parseInt(s.get('stepId'))),
      ) || 0;
      maxNode += 1;
      const id = `n${maxNode}`;
      const steps = this.get('projectWorkflow.projectWorkflowSteps');
      const step = steps.createRecord();
      this.get('cy').style().selector(`.${id}`).style({}).update();
      const classes = `${componentName} ${id} created`;
      const extent = this.get('cy').extent();
      this
        .get('cy')
        .add([{
          group: 'nodes',
          data: { id, text: '', step_id: maxNode },
          position: { x: extent.x1 + 100, y: extent.y1 + 100 },
        }])
        .addClass(classes);
      step.setProperties({
        stepId: maxNode,
        nodeType: componentName,
      });
      const node = {
        data: {
          text: '',
          id,
          step_id: maxNode,
          width: self.cy.$(`.${id}`).width(),
          height: self.cy.$(`.${id}`).height(),
        },
        position: { x: extent.x1 + 100, y: extent.y1 + 100 },
        edges: [],
        size: {
          width: self.cy.$(`.${id}`).width(),
          height: self.cy.$(`.${id}`).height(),
        },
      };
      step.set('node', node);
      if (componentName != 'document' && componentName != 'startStop') {
        const task = this.get('store').createRecord('task');
        task.set('type', _.startCase(componentName));
        task.set('project', this.get('project'));
        step.set('task', task);
      }
    },
    redrawGraph() {
      const self = this;
      self.get('projectWorkflow.projectWorkflowSteps').map((step) => {
        const node = _.clone(step.get('node')) || {};
        node.classes = `${node.data.id} ${step.get('nodeType')} ${self.taskStatus(step)}`;
        node.group = 'nodes';
        node.edges = null;
        node.position = {
          x: parseInt(node.position.x, 10),
          y: parseInt(node.position.y, 10),
        };
        const cyNode = self.get('cy').nodes(`.${node.data.id}`);
        if (cyNode.length) {
          cyNode.json(node);
        } else {
          self.get('cy').add(node);
        }
      });
      self.get('projectWorkflow.projectWorkflowSteps').forEach((step) => {
        if (step.get('node') && step.get('node').edges) {
          _.forEach(step.get('node').edges, (e) => {
            const edge = _.clone(e);
            edge.group = 'edges';
            if (!_.isEmpty(edge.scratch)) {
              edge.classes = `${edge.data.id} edgebendediting-hasbendpoints cy-edge-bend-editing-highlight-bends`;
            } else {
              const sourceElement = self.get('cy').$(`.${edge.data.source}`);
              if (sourceElement.hasClass('decision')) {
                const targetNumber = parseInt(
                  _.slice(
                    edge.data.target, 1, edge.data.target.length,
                  ).join(''),
                  10,
                );
                if (_.includes((step.get('node').decision.YES || []).map(a => parseInt(a, 10)), targetNumber)) {
                  edge.classes = `${edge.data.id} yes`;
                } else if (_.includes((step.get('node').decision.NO || []).map(a => parseInt(a, 10)), targetNumber)) {
                  edge.classes = `${edge.data.id} no`;
                } else {
                  edge.classes = `${edge.data.id}`;
                }
              } else {
                edge.classes = `${edge.data.id}`;
              }
            }
            const cyEdge = self.get('cy').edges(`.${edge.data.id}`);
            if (cyEdge.length) {
              cyEdge.json(edge);
            } else {
              self.get('cy').add(edge);
            }
            self.get('cy').trigger('click');
            self.get('cy').nodes().select();
            self.get('cy').nodes().unselect();
          });
        }
      });
    },
    updateLabel(label, decision) {
      const self = this;
      self.get('cy').$(`.${this.get('selectedElement')}`).data('text', label);
      if (decision) {
        const source = self.get('cy').$(`.${this.get('selectedElement')}`).data('source');
        const target = self.get('cy').$(`.${this.get('selectedElement')}`).data('target');
        const stepId = parseInt(_.slice(target, 1, target.length).join(''));
        const decisionDetails = self.get('cy').$(`.${source}`).data('decision') || {};
        if (!decisionDetails.YES) {
          decisionDetails.YES = [];
        }
        if (!decisionDetails.NO) {
          decisionDetails.NO = [];
        }
        if (decision === 'YES') {
          self.get('cy').$(`.${this.get('selectedElement')}`).removeClass('no');
          self.get('cy').$(`.${this.get('selectedElement')}`).removeClass('not-decided');
          self.get('cy').$(`.${this.get('selectedElement')}`).addClass('yes');
          _.remove(
            decisionDetails.NO,
            d => d === stepId || d === stepId.toString(),
          );
          _.remove(
            decisionDetails.YES,
            d => d === stepId || d === stepId.toString(),
          );
        } else if (decision === 'NO') {
          self.get('cy').$(`.${this.get('selectedElement')}`).addClass('no');
          self.get('cy').$(`.${this.get('selectedElement')}`).removeClass('not-decided');
          self.get('cy').$(`.${this.get('selectedElement')}`).removeClass('yes');
          _.remove(
            decisionDetails.YES,
            d => d === stepId || d === stepId.toString(),
          );
          _.remove(
            decisionDetails.NO,
            d => d === stepId || d === stepId.toString(),
          );
        }
        decisionDetails[decision].push(stepId);
        self.get('cy').$(`.${source}`).data('decision', decisionDetails);
      }
      this.set('selectedElement', null);
      this.set('labelToEdit', '');
      this.set('selectedDecision', 'YES');
      this.set('labelEditorActive', false);
    },
    showActionPopup(nodeType, node, step) {
      this.set('selectedNode', node);
      this.set('selectedStep', step);
      this.set(`${nodeType}Active`, true);
    },
    updateCommunication(step, name) {
      this.sendAction('makeDirty', true);
      const self = this;
      const nodeId = this.get('selectedNode').data('id');
      this.set('communicationActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({ text: name });
        _.forEach([
          'created', 'approved', 'rejected', 'fully-configured',
          'waiting-approval', 'complete', 'current-task',
        ], (state) => {
          self.get('cy').$(`.${nodeId}`).removeClass(state);
        });
        self.get('cy').$(`.${nodeId}`).addClass(
          self.taskStatus(step),
        );
      }, 100);
    },
    updateDocumentInfo(step, name) {
      this.sendAction('makeDirty', true);
      const self = this;
      const nodeId = this.get('selectedNode').data('id');
      this.set('documentInfoActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({
          text: name,
          document_id: step.get('task.id'),
        });
        _.forEach([
          'created', 'approved', 'rejected', 'fully-configured',
          'waiting-approval', 'complete', 'current-task',
        ], (state) => {
          self.get('cy').$(`.${nodeId}`).removeClass(state);
        });
        self.get('cy').$(`.${nodeId}`).addClass(
          self.taskStatus(step),
        );
      }, 100);
    },
    updateDecision(step, name) {
      this.sendAction('makeDirty', true);
      const self = this;
      const nodeId = this.get('selectedNode').data('id');
      this.set('decisionActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({ text: name });
        _.forEach([
          'created', 'approved', 'rejected', 'fully-configured',
          'waiting-approval', 'complete', 'current-task',
        ], (state) => {
          self.get('cy').$(`.${nodeId}`).removeClass(state);
        });
        self.get('cy').$(`.${nodeId}`).addClass(
          self.taskStatus(step),
        );
      }, 100);
    },
    updateAction(step, name) {
      console.log(step);
      this.sendAction('makeDirty', true);
      const self = this;
      const nodeId = this.get('selectedNode').data('id');
      this.set('actionActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({ text: name });
        _.forEach([
          'created', 'approved', 'rejected', 'fully-configured',
          'waiting-approval', 'complete', 'current-task',
        ], (state) => {
          self.get('cy').$(`.${nodeId}`).removeClass(state);
        });
        self.get('cy').$(`.${nodeId}`).addClass(
          self.taskStatus(step),
        );
      }, 100);
    },
    updateStartStop(step, name) {
      this.sendAction('makeDirty', true);
      const self = this;
      const nodeId = this.get('selectedNode').data('id');
      this.set('startStopActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({ text: name });
        _.forEach([
          'created', 'approved', 'rejected', 'fully-configured',
          'waiting-approval', 'complete', 'current-task',
        ], (state) => {
          self.get('cy').$(`.${nodeId}`).removeClass(state);
        });
        self.get('cy').$(`.${nodeId}`).addClass(
          self.taskStatus(step),
        );
      }, 100);
    },
    cancelCommunication() {
      this.set('communicationActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
    },
    cancelDocumentInfo() {
      this.set('documentInfoActive', false);
      this.set('selectedDocument', null);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
    },
    cancelDecision() {
      this.set('decisionActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
    },
    cancelAction() {
      this.set('actionActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
    },
    cancelStartStop() {
      this.set('startStopActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
    },
    showNotification(message) {
      const self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function() {
        self.set('notification.type', 0);
      }, 2000);
    },
    removeStep(step) {
      this.set('communicationActive', false);
      this.set('documentInfoActive', false);
      this.set('decisionActive', false);
      this.set('actionActive', false);
      this.set('startStopActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      const id = step.get('node.data.id');
      if (step.get('id')) {
        step.set('_destroy', true);
      } else {
        step.destroyRecord();
      }
      this.get('cy').remove(`.${id}`);
    },
    cancel() {
      const reload = confirm("Do you wan't to discard your changes and reload the page?");
      if (reload) {
        window.location.reload();
      }
    },
    save() {
      const message = 'Workflow has been saved';
      const published = true;
      NProgress.start();
      this.set('saving', true);
      const self = this;
      const edges = this.get('cy').edges();
      let nodeId,
        nodeEdges,
        stepIndex,
        step,
        target,
        edgeData,
        points,
        stepNode;
      const nodes = self.get('cy').nodes();
      const steps = this.get('projectWorkflow.projectWorkflowSteps');
      let toContinue = true;
      if (nodes.length <= 0) {
        NProgress.done();
        alert('Add atleast one task');
        self.set('saving', false);
      } else if (nodes.filter(n => !n.data('text') || _.isEmpty(n.data('text'))).length) {
        NProgress.done();
        alert('Tasks should have names');
        self.set('saving', false);
      } else {
        _.forEach(nodes, (node) => {
          if (node.hasClass('document')) {
            if (_.isEmpty(node.data('document_id')) && published) {
              NProgress.done();
              alert('Please attach all documents before saving');
              toContinue = false;
              return false;
            }
          } else if (node.hasClass('decision')) {
            if (
              published && (_.isEmpty(node.data('decision')) ||
                !node.data('decision').YES ||
                !node.data('decision').NO)
            ) {
              NProgress.done();
              alert('Decision tasks need to have both true and false logic');
              toContinue = false;
              return false;
            }
          }
          nodeId = node.data('step_id');
          nodeEdges = _.filter(edges, edge => edge.data('source') === `n${nodeId}`);
          step = steps.find(
            s => parseInt(s.get('stepId'), 10) === parseInt(node.data('step_id'), 10),
          );
          stepNode = step.get('node') || {};
          stepNode.data = node.data();
          stepNode.data.width = node.width();
          stepNode.data.height = node.height();
          stepNode.position = node.position();
          stepNode.edges = {};
          if (node.data('decision')) {
            stepNode.decision = node.data('decision');
          }
          if (node.data('document_id')) {
            stepNode.document_id = node.data('document_id');
          }
          let counter = 0;
          _.forEach(nodeEdges, (edge) => {
            target = _.find(nodes, n => n.data('id') === edge.data('target'));
            edgeData = edge.data();
            points = self.instance.getSegmentPoints(edge);
            if (points) {
              edgeData.bendPointPositions = points;
            }
            stepNode.edges[counter] = {
              data: edgeData,
              scratch: edge.scratch(),
            };
            counter += 1;
          });
          step.set('node', stepNode);
        });
        if (toContinue) {
          this.get('cy').elements().unselect();
          // this.get('cy').edgehandles('disable');
          this.get('cy').nodeResize({ boundingRectangle: false });
          this.set('projectWorkflow.snapshot', this.get('cy').png({ full: true }));
          NProgress.start();
          this.sendAction('save', this.get('projectWorkflow'), function(error) {
            if (error) {
              NProgress.done();
              self.set('saving', false);
              self.send(
                'showNotification',
                'Sorry, There was a technical glitch in saving the workflow.',
              );
            } else {
              self.send('showNotification', 'Workflow has been saved successfully');
              setTimeout(() => {
                NProgress.done();
                window.location.reload();
              }, 2000);
            }
          });
        } else {
          self.set('saving', false);
        }
      }
    },
    showWorkflowInformation() {
      this.set('workflowInstruction', true);
    },
  },
});
