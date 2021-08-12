import Ember from 'ember';
import * as _ from 'lodash';

export default Ember.Component.extend({
  classNames: ['flex-container'],
  cy: null,
  selectedNode1: null,
  selectedNode2: null,
  selectedNode: null,
  selectedEdge: null,
  selectedStep: null,
  graphAction: null,
  instance: null,
  workflowPickerActive: false,
  setApproverActive: false,
  communicationActive: false,
  actionActive: false,
  decisionActive: false,
  documentInfoActive: false,
  menuInstance: null,
  newTemplate: false,
  labelEditorActive: false,
  store: Ember.inject.service('store'),
  labelToEdit: '',
  selectedElement: null,
  isDecision: false,
  snapshot: null,
  showPreview: false,
  router: Ember.inject.service('-routing'),
  documentPickerActive: false,
  selectedDocumentNode: null,
  notification: {
    type: 0,
    msg: ''
  },
  steps: [],
  didInsertElement() {
    const self = this;
    // Element does not exist.
    const elements = [];
    self.set(
      'cy', cytoscape({
        container: document.getElementById('workflow-editor'),
        zoomingEnabled: false,
        layout: {
          name: 'grid'
        },
        pan: { x: 0, y: 0 },
        style: [{
          selector: '.startStop',
          style: {
            width: function(node) {
              return node.data('width') || 60;
            },
            height: function(node) {
              return node.data('height') || 60;
            },
            'background-color': '#FCB95E',
            // 'border-color': 'black',
            // 'border-width': '1px',
            color: 'white',
            label: 'data(text)',
            'font-family': 'Roboto',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        }, {
          selector: 'edge',
          style: {
            'line-color': '#1AA2C5',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#1AA2C5',
            color: 'black',
            'font-family': 'Roboto',
          }
        }, {
          selector: '.yes',
          style: {
            'line-color': 'green',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'green',
            color: 'black',
            'font-family': 'Roboto',
          }
        }, {
          selector: '.no',
          style: {
            'line-color': 'red',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'red',
            color: 'black',
            'font-family': 'Roboto',
          }
        }, {
          selector: '.not-decided',
          style: {
            'line-color': '#1AA2C5',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#1AA2C5',
          }
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
          }
        }, {
          selector: 'edge:selected',
          style: {
            width: 2,
            'curve-style': 'bezier',
            label: 'data(text)',
            'target-arrow-shape': 'triangle',
            'line-color': 'blue',
            'target-arrow-color': 'blue',
          }
        }, {
          selector: '.document',
          style: {
            width: function(node) {
              return node.data('width') || 50;
            },
            height: function(node) {
              return node.data('height') || 50;
            },
            padding: 10,
            shape: 'rectangle',
            'font-family': 'Roboto',
            'background-color': '#0097BF',
            // 'border-color': 'black',
            color: 'white',
            'text-wrap': 'wrap',
            'text-max-width': 110,
            // 'border-width': '1px',
            label: 'data(text)',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        }, {
          selector: '.action',
          style: {
            width: function(node) {
              return node.data('width') || 50;
            },
            height: function(node) {
              return node.data('height') || 50;
            },
            padding: 10,
            shape: 'hexagon',
            'background-color': '#005A85',
            // 'border-color': 'black',
            'font-family': 'Roboto',
            'text-wrap': 'wrap',
            color: 'white',
            'text-max-width': 110,
            // 'border-width': '1px',
            label: 'data(text)',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        }, {
          selector: '.document-has-document',
          style: {
            'background-image': '/assets/images/doc.png',
            'background-height': '50px',
            'background-width': '50px',
            'background-position-x': function(ele) {
              return ele.width() - 35;
            },
            'background-position-y': function(ele) {
              return ele.height() - 30;
            }
          }
        }, {
          selector: '.decision',
          style: {
            width: function(node) {
              return node.data('width') || 15;
            },
            height: function(node) {
              return node.data('height') || 15;
            },
            padding: '40px',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            shape: 'diamond',
            'font-family': 'Roboto',
            color: 'white',
            'background-color': '#E64B27',
            // 'border-color': 'black',
            // 'border-width': '1px',
            label: 'data(text)',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        }, {
          selector: '.communication',
          style: {
            'width': function(node) {
              return node.data('width') || 15;
            },
            'height': function(node) {
              return node.data('height') || 15;
            },
            padding: '40px',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            shape: 'triangle',
            'background-color': '#59CFEE',
            'font-family': 'Roboto',
            // 'border-color': 'black',
            // 'border-width': '1px',
            label: 'data(text)',
            color: 'white',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        }, {
          selector: '.edgehandles-hover',
          css: {
            'background-color': 'red'
          }
        }, {
          selector: '.edgehandles-source',
          css: {
            'border-width': 2,
            'border-color': 'red'
          }
        }, {
          selector: '.edgehandles-target',
          css: {
            'border-width': 2,
            'border-color': 'red'
          }
        }, {
          selector: '.edgehandles-preview, .edgehandles-ghost-edge',
          css: {
            'line-color': 'red',
            'target-arrow-color': 'red',
            'source-arrow-color': 'red'
          }
        }],
        elements: [],
      })
    );
    self.get('projectWorkflow.projectWorkflowSteps').forEach(step => {
      let node = _.clone(step.get('node'));
      if (step.get('nodeType') === 'document') {
        if (step.get('task.id')) {
          node.classes = `${node.data.id} ${step.get('nodeType')} document-has-document fixedAspectRatioResizeMode`;
        } else {
          node.classes = `${node.data.id} ${step.get('nodeType')} document-has-no-document fixedAspectRatioResizeMode`;
        }
      } else {
        node.classes = `${node.data.id} ${step.get('nodeType')} document-has-no-document fixedAspectRatioResizeMode`;
      }
      node.group = 'nodes';
      node.edges = null;
      self.get('cy').add(node);
    });
    self.get('projectWorkflow.projectWorkflowSteps').forEach(step => {
      if (step.get('node') && step.get('node').edges) {
        _.forEach(_.toArray(step.get('node').edges), edge => {
          edge.group = 'edges';
          if (!_.isEmpty(edge.scratch)) {
            edge.classes = `${edge.data.id} edgebendediting-hasbendpoints cy-edge-bend-editing-highlight-bends`
          } else {
            const sourceElement = self.get('cy').$(`.${edge.data.source}`);
            const targetElement = self.get('cy').$(`.${edge.data.target}`);
            if (sourceElement.hasClass('decision')) {
              const targetNumber = parseInt(_.slice(edge.data.target, 1, edge.data.target.length).join(''));
              if (_.includes((step.get('node').decision['YES'] || []), targetNumber)) {
                edge.classes = `${edge.data.id} yes`;
              } else if (_.includes((step.get('node').decision['NO'] || []), targetNumber)) {
                edge.classes = `${edge.data.id} no`
              } else {
                edge.classes = `${edge.data.id}`
              }
            } else {
              edge.classes = `${edge.data.id}`
            }
          }
          self.get('cy').add(edge);
          self.get('cy').trigger('click');
          self.get('cy').nodes().select();
          self.get('cy').nodes().unselect();
        });
      }
    });
    self.set('counter', self.get('cy').nodes().length);
    self.set('edgeCounter', _.max(self.get('cy').edges().toArray().map(
      a => parseInt(_.slice(a.data('id'), 1, a.data('id').length).join(''))
    )) || 0);
    self.get('cy').snapToGrid({ drawGrid: false });
    const defaults = {
      preview: false, // whether to show added edges preview before releasing selection
      enabled: true, // whether to start the plugin in the enabled state
      toggleOffOnLeave: true, // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
      loopAllowed: function() { return false },
      nodeLoopOffset: -50, // offset for edgeType: 'node' loops
      edgeParams: function(sourceNode, targetNode, i) {
        self.set('edgeCounter', self.get('edgeCounter') + 1);
        let id = `e${self.get('edgeCounter')}`;
        return {
          group: 'edges',
          data: {
            id: id,
            source: sourceNode.data('id'),
            target: targetNode.data('id'),
            text: '',
          },
          classes: `${id}`,
        };
      },
      complete: function(sourceNode, targetNodes, addedEntities) {
        if (sourceNode.hasClass('decision')) {
          self.set('isDecision', true);
        } else {
          self.set('isDecision', false);
        }
        self.set('selectedElement', addedEntities[0].data('id'));
        self.set('labelToEdit', '');
        self.set('labelEditorActive', true);
        self.$('#workflow-label').val('');
      }
    };
    self.get('cy').edgehandles(defaults);
    let steps = this.get('projectWorkflow.projectWorkflowSteps');
    this.set(
      'instance',
      self.get('cy').edgeBendEditing({
        bendPositionsFunction: function(ele) {
          return ele.data('bendPointPositions');
        },
        initBendPointsAutomatically: false,
        undoable: false,
        bendShapeSizeFactor: 6,
        enabled: true,
        addBendMenuItemTitle: 'Add Bend Point',
        removeBendMenuItemTitle: 'Remove Bend Point'
      })
    );
    Ember.$('.fa-times,.fa-bars,.fa-caret-right,.fa-caret-left').on('click', function(){
      setTimeout(() => self.get('cy').resize(), 600);
    });
    this.set(
      'menuInstance', this.get('cy').contextMenus({
        menuItems: [{
          id: 'remove-edge',
          title: 'Remove',
          selector: 'edge',
          onClickFunction: function(evt) {
            self.get('cy').$(`.${evt.target.data('id')}`).remove();
          },
        }, {
          id: 'label',
          title: 'Change Name',
          selector: 'edge',
          onClickFunction: function(evt) {
            self.set('selectedElement', evt.target.data('id'));
            if (
              evt.target.data('source') &&
                self.get('cy').$(`.${evt.target.data('source')}`).hasClass('decision')
            ) {
              self.set('isDecision', true);
            } else {
              self.set('isDecision', false);
            }
            self.set('labelToEdit', evt.target.data('text') || '');
            self.set('labelEditorActive', true);
            self.$('#workflow-label').val(evt.target.data('text') || '');
          }
        }],
        menuItemClasses: [
          'ctxt-item', // add class names to this list
        ],
        contextMenuClasses: [
          'ctxt-menu'
        ]
      })
    );
    self.get('cy').ready(function(event) {
      event.cy.edges().select();
      event.cy.edges().unselect();
      event.cy.nodes().select();
      event.cy.nodes().unselect();
      event.cy.on('cxttap', '.communication', function(evt) {
        self.set('selectedNode', evt.target);
        const step = self.get('projectWorkflow.projectWorkflowSteps').find(
          s => s.get('stepId') === parseInt(evt.target.data('step_id')),
        );
        self.set('selectedStep', step);
        self.set('communicationActive', true);
      });
      event.cy.on('cxttap', '.action', function(evt) {
        const step = self.get('projectWorkflow.projectWorkflowSteps').find(
          s => s.get('stepId') === parseInt(evt.target.data('step_id')),
        );
        self.set('selectedStep', step);
        self.set('actionActive', true);
      });
      event.cy.on('cxttap', '.document', function(evt) {
        const step = self.get('projectWorkflow.projectWorkflowSteps').find(
          s => s.get('stepId') === parseInt(evt.target.data('step_id')),
        );
        self.set('selectedStep', step);
        self.set('documentInfoActive', true);
      });
      event.cy.on('cxttap', '.decision', function(evt) {
        const step = self.get('projectWorkflow.projectWorkflowSteps').find(
          s => s.get('stepId') === parseInt(evt.target.data('step_id')),
        );
        self.set('selectedStep', step);
        self.set('decisionActive', true);
      });
        // self.instance.initBendPoints(self.get('cy').edges()[0]);
    });
    setTimeout(() => {
      // self.get('cy').trigger('click');
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
        setWidth: function(node, width) {
          node.css('width', width);
        },
        setHeight: function(node, height) {
          node.css('height', height);
        },

        isFixedAspectRatioResizeMode: function (node) { return node.is('.startStop') },// with only 4 active grapples (at corners)
      });
      // _.times(self.get('steps').length, () => self.$('#add-document').click());
    }, 50);
    self.get('cy').nodes().select();
    self.get('cy').nodes().unselect();
    self.get('cy').edges().select();
    self.get('cy').edges().unselect();
    window.cy = self.get('cy');
  },
  willDestroyElement() {
    this.get('menuInstance').destroy();
  },
  actions: {
    addComponent(componentName) {
      const self = this;
      this.set('counter', this.get('counter') + 1);
      let id = `n${this.get('counter')}`;
      let x = _.max(_.map(this.get('cy').nodes(), node => node.position()['x'] + node.width() + 100 )) || 100;
      let steps = this.get('projectWorkflow.projectWorkflowSteps');
      this.get('cy').style().selector(`.${id}`).style({}).update();
      let classes;
      if (componentName === 'document') {
        classes = `document ${id} document-has-no-document`
      } else {
        classes = `${componentName} ${id}`
      }
      const extent = this.get('cy').extent();
      this
        .get('cy')
        .add([{
          group: 'nodes',
          data: { id: id, text: '', step_id: this.get('counter') },
          position: { x: extent.x1 + 100, y: extent.y1 + 100 },
        }])
        .addClass(classes);
      let step = this.get('projectWorkflow.projectWorkflowSteps').createRecord();
      step.setProperties({
        stepId: this.get('counter'),
        nodeType: componentName,
        node: {
          data: {
            text: '', id: id, step_id: self.get('counter'),
            width: self.get('cy').$(`.${id}`).width(),
            height: self.get('cy').$(`.${id}`).height(),
          },
          position: { x: extent.x1 + 100, y: extent.y1 + 100 },
          edges: [],
          size: {
            width: self.get('cy').$(`.${id}`).width(),
            height: self.get('cy').$(`.${id}`).height(),
          }
        }
      });
    },
    addEdge() {
      this.set('edgeCounter', this.get('edgeCounter') + 1);
      let id = `e${this.get('edgeCounter')}`;
      this.get('cy').add([{
        group: 'edges',
        data: {
          id: id,
          source: this.get('selectedNode1'),
          target: this.get('selectedNode2'),
          text: '',
        },
        classes: `${id}`,
      }]);
      this.get('cy').style().selector(`.${this.get('selectedNode1')}`).style({
        'border-color': 'black',
      }).update();
      this.get('cy').style().selector(`.${this.get('selectedNode2')}`).style({
        'border-color': 'black',
      }).update();
      let sourceStepId = parseInt(
        _.slice(this.selectedNode1, 1, this.selectedNode1.length).join('')
      );
      let targetStepId = parseInt(
        _.slice(this.selectedNode2, 1, this.selectedNode2.length).join('')
      );
      this.set('selectedNode1', null);
      this.set('selectedNode2', null);
    },
    updateLabel(label, decision) {
      const self = this;
      self.get('cy').$(`.${this.get('selectedElement')}`).data('text', label);
      if (decision) {
        const source = self.get('cy').$(`.${this.get('selectedElement')}`).data('source');
        const target = self.get('cy').$(`.${this.get('selectedElement')}`).data('target');
        if (decision === 'YES') {
          self.get('cy').$(`.${this.get('selectedElement')}`).removeClass('no');
          self.get('cy').$(`.${this.get('selectedElement')}`).removeClass('not-decided');
          self.get('cy').$(`.${this.get('selectedElement')}`).addClass('yes');
        } else if (decision === 'NO') {
          self.get('cy').$(`.${this.get('selectedElement')}`).addClass('no');
          self.get('cy').$(`.${this.get('selectedElement')}`).removeClass('not-decided');
          self.get('cy').$(`.${this.get('selectedElement')}`).removeClass('yes');
        }
        const decisionDetails = self.get('cy').$(`.${source}`).data('decision') || {};
        if (!decisionDetails[decision]) {
          decisionDetails[decision] = [];
        }
        decisionDetails[decision].push(
          parseInt(_.slice(target, 1, target.length).join(''))
        );
        self.get('cy').$(`.${source}`).data('decision', decisionDetails);
      }
      this.set('selectedElement', null);
      this.set('labelToEdit', '');
      this.set('labelEditorActive', false);
    },
    removeNode() {
      this.get('cy').$(`.${this.get('selectedNode1')}`).remove();
      this.set('selectedNode1', null);
    },
    removeEdge() {
      this.get('cy').$(`.${this.get('selectedEdge')}`).remove();
      this.set('selectedEdge', null);
    },
    selectDocument(documentId) {
      let self = this;
      let steps = this.get('projectWorkflow.projectWorkflowSteps');
      let step = steps.find(s => s.get('stepId') === self.get('selectedDocumentNode'));
      let node = step.get('node') || {};
      node.data.document_id = documentId;
      node.document_id = documentId;
      step.set('node', node);
      node = this.get('cy').$(`.n${self.get('selectedDocumentNode')}`);
      node.data('document_id', documentId);
      node.removeClass('document-has-no-document');
      node.addClass('document-has-document');
      this.set('selectedDocumentNode', null);
      this.set('documentPickerActive', false);
    },
    save() {
      const published = true;
      NProgress.start();
      const self = this;
      let edges = this.get('cy').edges();
      let nodeId, nodeEdges, stepIndex, step, target, edgeData, points;
      let nodes = self.get('cy').nodes();
      let steps = this.get('steps');
      let toContinue = true;
      if (nodes.length <= 0) {
        NProgress.done();
        alert('Add atleast one node');
      } else {
        _.forEach(nodes, node => {
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
                !node.data('decision')['YES'] ||
                !node.data('decision')['NO'])
            ) {
              NProgress.done();
              alert('Decision nodes need to have both true and false flows');
              toContinue = false;
              return false;
            }
          }
          nodeId = node.data('step_id');
          nodeEdges = edges.filter(edge => edge.data('source') === `n${nodeId}`);
          step = this.get('projectWorkflow.projectWorkflowSteps').find(
            s => s.get('stepId') === parseInt(nodeId)
          );
          step.set('stepId', nodeId);
          let stepNode = step.get('node') || {};
          stepNode.data = node.data();
          stepNode.data.width = node.width();
          stepNode.data.height = node.height();
          stepNode.position = node.position();
          stepNode.edges = {};
          let counter = 0;
          if (node.data('decision')) {
            stepNode.decision = node.data('decision');
          }
          if (node.data('document_id')) {
            stepNode.document_id = node.data('document_id');
            step.set('taskId', node.data('document_id'));
          }
          nodeEdges.forEach(edge => {
            target = _.find(nodes.toArray(), n => n.data('id') === edge.data('target'));
            edgeData = edge.data();
            points = self.instance.getSegmentPoints(edge);
            if (points) {
              edgeData.bendPointPositions = points;
            }
            stepNode.edges[counter] = {
              data: edgeData,
              scratch: edge.scratch(),
            };
            counter++;
          });
          console.log(stepNode);
          step.set('node', stepNode);
        });
        if (toContinue) {
          this.get('cy').elements().unselect();
          this.get('cy').edgehandles('disable');
          this.get('cy').nodeResize({ boundingRectangle: false });
          this.get('projectWorkflow').setProperties({
            snapshot: this.get('cy').png()
          });
          if (this.get('projectWorkflow').get('id')) {
            this.set('newTemplate', false);
          }
          this.projectWorkflow.save().then((template) => {
            NProgress.done();
            self.set('projectWorkflow', template);
            self.send('showNotification', 'Workflow has been saved')
          });
        }
      }
    },

    toggleDocumentPicker() {
      this.set('documentPickerActive', !this.get('documentPickerActive'));
    },
    generatePreview() {
      this.get('cy').fit();
      this.set('snapshot', this.get('cy').png({ full: true }));
      this.set('showPreview', true);
    },
    updateCommunication(communication, name) {
      const self = this;
      // const step = this.get('projectWorkflow.projectWorkflowSteps').find(
      //   s => s.get('stepId') === communication.get('stepId')
      // );
      Ember.set(this.get('cy').nodes(`.n${communication.get('stepId')}`).data(), 'text', name);
      self.get('cy').nodes(`.n${communication.get('stepId')}`).trigger('tap');
      self.set('cy', self.get('cy'));
      self.set('communicationActive', false);
      // self.sendAction('reloadPage');
    },
    updateAction(step) {
      const self = this;
      this.get('projectWorkflow.projectWorkflowSteps').pushObject(step);
      self.set('actionActive', false);
      self.send('showNotification', 'Action has been updated successfully');
      self.sendAction('reloadPage');
    },
    updateDecision(step) {
      const self = this;
      this.get('projectWorkflow.projectWorkflowSteps').pushObject(step);
      self.set('decisionActive', false);
      self.send('showNotification', 'Decision has been updated successfully');
      self.sendAction('reloadPage');
    },
    updateDocumentInfo(step) {
      const self = this;
      this.get('projectWorkflow.projectWorkflowSteps').pushObject(step);
      self.set('documentInfoActive', false);
      self.send('showNotification', 'Task has been updated successfully');
      self.sendAction('reloadPage');
    },
    showNotification(message) {
      let self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function() {
        self.set('notification', {
          type: 0,
          msg: '',
        });
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
        this.get('projectWorkflow.project.id')
      );
    },
  }
});
