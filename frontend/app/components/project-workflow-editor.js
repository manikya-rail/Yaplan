import Ember from 'ember';
import * as _ from 'lodash';

export default Ember.Component.extend({
  classNames: ['flex-container'],
  cy: null,
  counter: 0,
  edgeCounter: 0,
  selectedNode1: null,
  selectedNode2: null,
  selectedEdge: null,
  graphAction: null,
  instance: null,
  menuInstance: null,
  newTemplate: false,
  labelEditorActive: false,
  store: Ember.inject.service('store'),
  labelToEdit: '',
  selectedElement: null,
  isDecision: false,
  steps: [],
  snapshot: null,
  showPreview: false,
  router: Ember.inject.service('-routing'),
  documentPickerActive: false,
  docs: Ember.computed('documents.@each', function() {
    debugger;
    return this.get('documents').filter(
      d => d.get('isTemplate') && d.get('isPublic')
    );
  }),
  notification: {
    type: 0,
    msg: ''
  },
  selectedDocumentNode: null,
  categoryId: Ember.computed('projectWorkflow.category', function() {
    return this.get('projectWorkflow.category').get('id');
  }),
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
            'background-color': '#fff',
            'border-color': '#898989',
            'border-width': '1px',
            color: '#484848',
            label: 'data(text)',
            'font-family': 'Lato',
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
            'font-family': 'Lato',
          }
        }, {
          selector: '.yes',
          style: {
            'line-color': '#3cba54',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#3cba54',
            color: 'black',
            'font-family': 'Lato',
          }
        }, {
          selector: '.no',
          style: {
            'line-color': '#db3236',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#db3236',
            color: 'black',
            'font-family': 'Lato',
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
            'font-family': 'Lato',
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
              return node.data('width') || 60;
            },
            height: function(node) {
              return node.data('height') || 20;
            },
            padding: 10,
            shape: 'rectangle',
            'font-family': 'Lato',
            'background-color': '#fff',
            'border-color': '#0064d2',
            color: '#484848',
            'text-wrap': 'wrap',
            'text-max-width': function(node) {
              return node.width();
            },
            'border-width': '1px',
            label: 'data(text)',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        }, {
          selector: '.action',
          style: {
            width: function(node) {
              return node.data('width') || 60;
            },
            height: function(node) {
              return node.data('height') || 30;
            },
            padding: 10,
            shape: 'roundrectangle',
            'background-color': '#fff',
            'border-color': '#000387',
            'font-family': 'Lato',
            color: '#484848',
            'text-wrap': 'wrap',
            'text-max-width': function(node) {
              return node.width();
            },
            'border-width': '1px',
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
              return node.data('width') || 60;
            },
            height: function(node) {
              return node.data('height') || 60;
            },
            'text-wrap': 'wrap',
            'text-max-width': function(node) {
              return node.width();
            },
            shape: 'diamond',
            'font-family': 'Lato',
            color: '#484848',
            'background-color': '#fff',
            'border-color': '#51caff',
            'border-width': '1px',
            label: 'data(text)',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        }, {
          selector: '.communication',
          style: {
            'width': function(node) {
              return node.data('width') || 120;
            },
            'height': function(node) {
              return node.data('height') || 60;
            },
            'text-wrap': 'wrap',
            'text-max-width': function(node) {
              return node.width();
            },
            'background-color': '#fff',
            'font-family': 'Lato',
            'border-color': '#34455b',
            'border-width': '1px',
            label: 'data(text)',
            color: '#484848',
            'text-valign': 'center',
            'text-halign': 'center',
          }
        }, {
          selector: '.edgehandles-hover',
          css: {
            'background-color': 'red'
          }
        }, {
          selector: '.edgehandles-source',
          css: {
            'border-width': 1,
            'border-color': 'red'
          }
        }, {
          selector: '.edgehandles-target',
          css: {
            'border-width': 1,
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
    _.forEach(self.get('projectWorkflow').get('workflowSteps'), step => {
      let node = _.clone(step.node);
      if (step.node_type === 'document') {
        if (step.task_id) {
          node.classes = `${node.data.id} ${step.node_type} document-has-document fixedAspectRatioResizeMode`;
        } else {
          node.classes = `${node.data.id} ${step.node_type} document-has-no-document fixedAspectRatioResizeMode`;
        }
      } else {
        node.classes = `${node.data.id} ${step.node_type} document-has-no-document fixedAspectRatioResizeMode`;
      }
      node.group = 'nodes';
      node.edges = null;
      node.position = {
        x: parseInt(node.position.x), y: parseInt(node.position.y)
      };
      self.get('cy').add(node);
    });
    _.forEach(self.get('projectWorkflow').get('workflowSteps'), step => {
      if (step.node && step.node.edges) {
        _.forEach(step.node.edges, edge => {
          edge.group = 'edges';
          if (!_.isEmpty(edge.scratch)) {
            edge.classes = `${edge.data.id} edgebendediting-hasbendpoints cy-edge-bend-editing-highlight-bends`
          } else {
            edge.classes = `${edge.data.id}`
          }
          self.get('cy').add(edge);
          self.get('cy').trigger('click');
          self.get('cy').nodes().select();
          self.get('cy').nodes().unselect();
        });
      }
    });
    self.set('counter', self.get('cy').nodes().length);
    self.set('edgeCounter', self.get('cy').edges().length);
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
    let steps = this.get('projectWorkflow').get('workflowSteps') || [];
    this.set('steps', steps);
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
          id: 'document',
          title: 'Add Document',
          selector: '.document-has-no-document',
          onClickFunction: function(evt) {
            self.set('selectedDocumentNode', evt.target.data('step_id'));
            self.set('documentPickerActive', true);
          },
        }, {
          id: 'document-change',
          title: 'Change Document',
          selector: '.document-has-document',
          onClickFunction: function(evt) {
            self.set('selectedDocumentNode', evt.target.data('step_id'));
            self.set('documentPickerActive', true);
          },
        }, {
          id: 'remove-node',
          title: 'Remove',
          selector: 'node',
          onClickFunction: function(evt) {
            let steps = _.clone(self.get('steps'));
            let stepIndex = _.findIndex(steps, s => s.step_id === evt.target.data('step_id'));
            let step = steps[stepIndex];
            if (step.id) {
              step = { id: step.id, _destroy: true };
              steps[stepIndex] = step;
            } else {
              _.remove(steps, s => s.step_id === evt.target.data('step_id'));
            }
            self.set('steps', steps)
            self.get('cy').$(`.n${evt.target.data('step_id')}`).remove();
          },
        }, {
          id: 'remove-edge',
          title: 'Remove',
          selector: 'edge',
          onClickFunction: function(evt) {
            self.get('cy').$(`.${evt.target.data('id')}`).remove();
          },
        }, {
          id: 'label',
          title: 'Change Name',
          selector: 'node,edge',
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
    setTimeout(() => {
      // self.get('cy').trigger('click');
      self.get('cy').nodeResize({
        padding: 5, // spacing between node and grapples/rectangle
        undoable: true, // and if cy.undoRedo exists
        grappleSize: 8, // size of square dots
        grappleColor: '#3cba54', // color of grapples
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
      let steps = _.clone(this.get('steps')) || [];
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
      let step = {
        step_id: this.get('counter'),
        node_type: componentName,
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
      };
      steps.push(step);
      this.set('steps', steps);
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
      let steps = _.clone(this.get('steps'));
      let stepIndex = _.findIndex(
        steps, step => step.step_id === self.get('selectedDocumentNode')
      );
      let step = steps[stepIndex];
      step.node.data.document_id = documentId;
      step.node.document_id = documentId;
      steps[stepIndex] = step;
      let node = this.get('cy').$(`.n${self.get('selectedDocumentNode')}`);
      node.data('document_id', documentId);
      node.removeClass('document-has-no-document');
      node.addClass('document-has-document');
      this.set('steps', steps);
      this.set('selectedDocumentNode', null);
      this.set('documentPickerActive', false);
    },
    save() {
      const message = 'Workflow has been saved';
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
          nodeEdges = _.filter(edges, edge => edge.data('source') === `n${nodeId}`);
          stepIndex = _.findIndex(steps, s => s.step_id === nodeId);
          step = steps[stepIndex] || { node: { edges: [] } };
          step.step_id = nodeId;
          step.node.data = node.data();
          step.node.data.width = node.width();
          step.node.data.height = node.height();
          step.node.position = node.position();
          step.node.edges = [];
          if (node.data('decision')) {
            step.node.decision = node.data('decision');
          }
          if (node.data('document_id')) {
            step.node.document_id = node.data('document_id');
            step.task_id = node.data('document_id');
          }
          _.forEach(nodeEdges, edge => {
            target = _.find(nodes, n => n.data('id') === edge.data('target'));
            edgeData = edge.data();
            points = self.instance.getSegmentPoints(edge);
            if (points) {
              edgeData.bendPointPositions = points;
            }
            step.node.edges.push({
              data: edgeData,
              scratch: edge.scratch(),
            });
          });
          if (stepIndex >= 0) {
            steps[stepIndex] = step;
          } else {
            steps.push(step);
          }
        });
        if (toContinue) {
          this.get('cy').elements().unselect();
          this.get('cy').edgehandles('disable');
          this.get('cy').nodeResize({ boundingRectangle: false });
          this.projectWorkflow.setProperties({
            workflowStepsAttributes: steps,
            snapshot: this.get('cy').png(),
          });
          this.projectWorkflow.save().then((template) => {
            NProgress.done();
            self.set('projectWorkflow', template);
            self.send('showNotification', message);
          });
        }
      }
    },
    setDecision(node, label, decision) {
    },
    toggleDocumentPicker() {
      this.set('documentPickerActive', !this.get('documentPickerActive'));
    },
    generatePreview() {
      this.get('cy').fit();
      this.set('snapshot', this.get('cy').png({ full: true }));
      this.set('showPreview', true);
    },
    showNotification(message) {
      let self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function() {
        self.set('notification.type', 0);
      }, 2000);
    },
  }
});
