import Ember from 'ember';
import * as _ from 'lodash';
// var snapToGrid = require('./cytoscape-snap-to-grid.js');
export default Ember.Component.extend({
  classNames: ['flex-container'],
  cy: null,
  selectedNode1: null,
  selectedNode2: null,
  selectedEdge: null,
  selectedStep: null,
  graphAction: null,
  instance: null,
  menuInstance: null,
  newTemplate: false,
  labelEditorActive: false,
  store: Ember.inject.service('store'),
  labelToEdit: '',
  selectedElement: null,
  isDecision: false,
  workflowInstruction: false,
  selectedDecision: 'YES',
  steps: [],
  snapshot: null,
  showPreview: false,
  catSortProps: ['updatedAt:desc'],
  sortedCategories: Ember.computed.sort('categories', 'catSortProps'),
  router: Ember.inject.service('-routing'),
  documentPickerActive: false,
  docs: Ember.computed('documents.@each', function() {
    return this.get('documents');
  }),
  saving: false,
  notification: {
    type: 0,
    msg: ''
  },
  descriptionCharacterCount: 0,
  selectedDocumentNode: null,
  categoryId: Ember.computed('workflowTemplate.category', function() {
    return this.get('workflowTemplate.category').get('id');
  }),
  startStopActive: false,
  documentInfoActive: false,
  decisionActive: false,
  communicationActive: false,
  actionActive: false,
  savedCyJson: null,
  findStep(stepId) {
    const possibleSteps = this.get(
      'workflowTemplate.workflowTemplateSteps',
    ).sortBy('createdAt').filter(
      s => parseInt(s.get('stepId'), 10) === parseInt(stepId, 10),
    );
    if (possibleSteps.get('length') > 1) {
      const newSteps = possibleSteps.filter(s => !s.get('id'));
      const steps = possibleSteps.filter(
        s => s.get('id') && !s.get('_destroy'),
      );
      if (steps.get('length')) {
        const firstObject = steps.get('firstObject');
        steps.forEach(s => {
          if (firstObject !== s) {
            s.set('_destroy', true);
          }
        });
        newSteps.forEach(s => {
          s.destroyRecord();
        });
        return firstObject;
      } else if (newSteps.get('length')) {
        const firstObject = newSteps.get('firstObject');
        newSteps.forEach(s => {
          if (firstObject !== s) {
            s.destroyRecord();
          }
        });
        return firstObject;
      } else {
        return null;
      }
    } else if (possibleSteps.get('length') === 1) {
      return possibleSteps.get('firstObject');
    } else {
      return null;
    }
  },

  initFormFields: function(){   
    if(this.get('workflowTemplate') !== null) {
      let w_template = this.get("workflowTemplate");
      this.set('workflowTemplate.description', this.get("workflowTemplate.description"));
      this.send('checkCharacter');
    } else {
      this.set('workflowTemplate.description', '');
      this.send('checkCharacter');
    }
  }.on('didReceiveAttrs'),

  didInsertElement() {
    const self = this;
    // Element does not exist.
    // debugger;
    const elements = [];
    const stepIds = self.get('workflowTemplate.workflowTemplateSteps').map(
      s => s.get('stepId')
    ).uniq();
    stepIds.forEach(stepId => self.findStep(stepId));
    self.set(
      'workflowTemplate.workflowTemplateSteps',
      self.get('workflowTemplate.workflowTemplateSteps').filter(
        step => step.get('id'),
      ),
    );
    self.set(
      'cy', cytoscape({
        container: document.getElementById('workflow-editor'),
        zoomingEnabled: false,
        layout: {
          name: 'grid'
        },
        pan: { x: 0, y: 0 },
        style: [{
          selector: 'node',
          style: {
            'font-size': '10pt',
          }
        }, {
          selector: '.startStop',
          style: {
            width: function(node) {
              return node.data('width') || 80;
            },
            height: function(node) {
              return node.data('height') || 80;
            },
            'text-wrap': 'wrap',
            'text-max-width': function(node) {
              return node.width();
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
            'line-color': '#747474',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#747474',
            color: 'black',
            'font-size': '10pt',
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
            'line-color': '#ededf1',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#ededf1',
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
              return node.data('width') || 180;
            },
            height: function(node) {
              return node.data('height') || 60;
            },
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
              return node.data('width') || 160;
            },
            height: function(node) {
              return node.data('height') || 80;
            },
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
        // }, {
        //   selector: '.document-has-document',
        //   style: {
        //     'background-image': function(node) {
        //       const bt = '<svg id="Group_2" data-name="Group 2" xmlns="http://www.w3.org/2000/svg" viewBox="948 528 24 24" width="24" height="24"><defs><style>.cls-1 {fill: #747474;fill-rule: evenodd;}</style></defs><path id="Path_5" data-name="Path 5" class="cls-1" d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Z" transform="translate(948 528)"/></svg>';
        //         return `data:image/svg+xml;base64,${window.btoa(bt)}`;
        //     },
        //     'background-position-x': 5,
        //   }
        }, {
          selector: '.decision',
          style: {
            width: function(node) {
              return node.data('width') || 80;
            },
            height: function(node) {
              return node.data('height') || 80;
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
            'background-color': '#2e353a'
          }
        }, {
          selector: '.edgehandles-source',
          css: {
            'border-width': 1,
            'border-color': '#2e353a'
          }
        }, {
          selector: '.edgehandles-target',
          css: {
            'border-width': 1,
            'border-color': '#2e353a'
          }
        }, {
          selector: '.edgehandles-preview, .edgehandles-ghost-edge',
          css: {
            'line-color': '#2e353a',
            'target-arrow-color': '#2e353a',
            'source-arrow-color': '#2e353a'
          }
        }],
        elements: [],
      })
    );
    self.get('workflowTemplate.workflowTemplateSteps').filter(
      step => !step.get('_destroy'),
    ).forEach(step => {
      let node = _.clone(step.get('node'));
      if (step.get('nodeType') === 'document') {
        if (step.get('task.id')) {
          node.classes = `${node.data.id} ${step.get('nodeType')} document-has-document fixedAspectRatioResizeMode`;
        } else {
          node.classes = `${node.data.id} ${step.get('nodeType')} document-has-no-document fixedAspectRatioResizeMode`;
        }
      } else {
        node.classes = `${node.data.id} ${step.get('nodeType')} fixedAspectRatioResizeMode`;
      }
      node.group = 'nodes';
      node.edges = null;
      self.cy.add(node);
    });
    self.get('workflowTemplate.workflowTemplateSteps').filter(
      step => !step.get('_destroy'),
    ).forEach(step => {
      if (!step.get('_destroy') && step.get('node.edges')) {
        _.forEach(step.get('node.edges'), edge => {
          edge.group = 'edges';
          if (!_.isEmpty(edge.scratch)) {
            edge.classes = `${edge.data.id} edgebendediting-hasbendpoints cy-edge-bend-editing-highlight-bends`
          } else if (step.get('nodeType') === 'decision') {
            let targetId = _.slice(edge.data.target, 1, edge.data.target.length).join('');
            if (step.get('node.decision') && step.get('node.decision.NO') && _.includes(step.get('node.decision.NO'), targetId)) {
              edge.classes = `${edge.data.id} no`
            } else if (step.get('node.decision') && step.get('node.decision.YES') && _.includes(step.get('node.decision.YES'), targetId)) {
              edge.classes = `${edge.data.id} yes`
            } else {
              edge.classes = `${edge.data.id}`;
            }
          } else {
            edge.classes = `${edge.data.id}`
          }
          self.cy.add(edge);
          self.cy.trigger('click');
          self.cy.nodes().select();
          self.cy.nodes().unselect();
        });
      }
    });
    self.set('counter', self.get('cy').nodes().length);
    self.set('edgeCounter', self.get('cy').edges().length);
    self.get('cy').ready(function (event) {
      event.cy.edges().select();
      event.cy.edges().unselect();
      event.cy.nodes().select();
      event.cy.nodes().unselect();
      event.cy.on('cxttap', '.communication', function (evt) {
        self.set('selectedNode', evt.target);
        const step = self.findStep(parseInt(evt.target.data('step_id'), 10));
        if (!step.get('communications.firstObject')) {
          step.get('communications').createRecord();
        }
        self.set('selectedStep', step);
        self.set('communicationActive', true);
      });
      event.cy.on('cxttap', '.action', function (evt) {
        self.set('selectedNode', evt.target);
        const step = self.findStep(parseInt(evt.target.data('step_id'), 10));
        if (!step.get('task.isTruthy')) {
          step.set(
            'task',
            self.get('store').createRecord('task', { type: 'Action' }),
          )
          // step.get('communications').createRecord();
        }
        self.set('selectedStep', step);
        self.set('actionActive', true);
      });
      event.cy.on('cxttap', '.document', function (evt) {
        self.set('selectedNode', evt.target);
        const step = self.findStep(parseInt(evt.target.data('step_id'), 10));
        self.set('selectedDocument', step.get('task'));
        self.set('selectedStep', step);
        self.set('documentInfoActive', true);
      });
      event.cy.on('cxttap', '.decision', function (evt) {
        self.set('selectedNode', evt.target);
        const step = self.findStep(parseInt(evt.target.data('step_id'), 10));
        self.set('selectedStep', step);
        self.set('decisionActive', true);
      });
      event.cy.on('cxttap', '.startStop', function (evt) {
        self.set('selectedNode', evt.target);
        const step = self.findStep(parseInt(evt.target.data('step_id'), 10));
        self.set('selectedStep', step);
        self.set('startStopActive', true);
      });
    });
    self.get('cy').snapToGrid({ drawGrid: false });
    const defaults = {
      preview: false, // whether to show added edges preview before releasing selection
      enabled: true, // whether to start the plugin in the enabled state
      toggleOffOnLeave: true, // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
      handleColor: '#2e353a',
      handleNodes: function(node) {
        return !node.is('.communication');
      },
      loopAllowed: function() { return false },
      nodeLoopOffset: -50, // offset for edgeType: 'node' loops
      edgeParams: function(sourceNode, targetNode, i) {
        let maxNode = _.max(
          self.cy.edges().toArray().map(
            e => parseInt(
              _.slice(e.data('id'), 1, e.data('id').length).join('')
            )
          )
        ) || 0;

        maxNode++;
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
    let steps = this.get('workflowTemplate').get('workflowTemplateSteps') || [];
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
      'menuInstance', this.cy.contextMenus({
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
        setWidth: function(node, width) {
          node.css('width', width);
        },
        setHeight: function(node, height) {
          node.css('height', height);
        },
        isFixedAspectRatioResizeMode: function (node) { return true },// with only 4 active grapples (at corners)
      });
      self.sendAction('setCy', self.get('cy'));
      self.sendAction('setCyJson', self.get('cy').json());
      // Ember.run.scheduleOnce('afterRender', this, function() {
      // });
      // Ember.$(window).bind('beforeunload', function() {
      //   console.log('exiting');
      //   return 'Text';
      // });
      // _.times(self.get('steps').length, () => self.$('#add-document').click());
    }, 50);
    self.cy.nodes().select();
    self.cy.nodes().unselect();
    self.cy.edges().select();
    self.cy.edges().unselect();
    window.cy = self.cy;
  },
  willDestroyElement() {
    this.get('menuInstance').destroy();
  },
  actions: {
    addComponent(componentName) {
      const self = this;
      let maxNode = _.max(
        this.get(
          'workflowTemplate.workflowTemplateSteps'
        ).map(s => parseInt(s.get('stepId')))
      ) || 0;
      maxNode += 1;
      const id = `n${maxNode}`;
      const steps = this.get('workflowTemplate.workflowTemplateSteps');
      const step = steps.createRecord();
      this.get('cy').style().selector(`.${id}`).style({}).update();
      let classes = `${componentName} ${id}`;
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
          id: id,
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
    updateLabel(label, decision) {
      const self = this;
      self.get('cy').$(`.${this.get('selectedElement')}`).data('text', label);
      if (decision) {
        const source = self.get('cy').$(`.${this.get('selectedElement')}`).data('source');
        const target = self.get('cy').$(`.${this.get('selectedElement')}`).data('target');
        const decisionDetails = self.get('cy').$(`.${source}`).data('decision') || {};
        const stepId = parseInt(_.slice(target, 1, target.length).join(''));
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
      this.set('selectedDocument', this.get('docs').findBy('id', documentId));
      let node = this.get('cy').$(`.n${self.get('selectedStep.node.data.id')}`);
      node.data('document_id', documentId);
      this.set('selectedStep.task', this.get('selectedDocument'))
      node.removeClass('document-has-no-document');
      node.addClass('document-has-document');
      this.set('documentPickerActive', false);
    },
    save(publish, justSave) {
      const alreadyPublished = _.clone(this.get('workflowTemplate.published'));
      let message;
      if (justSave) {
        message = 'Template has been saved';
      } else {
        message = `Template has been ${publish ? 'published' : 'unpublished'}`;
      }
      let published = false;
      if (publish && this.get('workflowTemplate.published') !== true) {
        published = true;
      }
      NProgress.start();
      let name = document.getElementById('workflow-name').value;
      let description = document.getElementById('workflow-description').value;
      let categoryId = parseInt(document.getElementById('workflow-category').value);
      let category = this.get('store').peekRecord('category', categoryId);
      if (_.isEmpty(name)) {
        alert('Template name is required');
        NProgress.done();
      } else if (_.isEmpty(description)) {
        alert('Template description is required');
        NProgress.done();
      } else {
        const self = this;
        let edges = this.cy.edges();
        let nodeId, nodeEdges, stepIndex, step, target, edgeData, points, stepNode;
        let nodes = self.cy.nodes();
        let steps = this.get('workflowTemplate.workflowTemplateSteps');
        let toContinue = true;
        if (nodes.length <= 0) {
          NProgress.done();
          alert('Please add atleast one task');
        } else if (publish && (nodes.filter(n => !n.data('text') || _.isEmpty(n.data('text'))).length)) {
          NProgress.done();
          alert('Tasks should have names');
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
                alert('Decision tasks need to have both true and false logic');
                toContinue = false;
                return false;
              }
            }
            nodeId = node.data('step_id');
            nodeEdges = _.filter(edges, edge => edge.data('source') === `n${nodeId}`);
            step = self.findStep(parseInt(nodeId, 10));
            // step = steps.find(s => s.get('stepId').toString() === nodeId.toString());
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
            this.cy.elements().unselect();
            this.cy.edgehandles('disable');
            this.cy.nodeResize({ boundingRectangle: false });
            this.get('workflowTemplate').setProperties({
              id: id,
              name: name,
              snapshot: this.cy.png({ full: true }),
              description: description,
              category: category,
              published: published
            });
            this.cy.edgehandles('enable');
            if (this.get('workflowTemplate').get('id')) {
              this.set('newTemplate', false);
            }
            this.set('saving', true);

            const newTemplate = !this.get('workflowTemplate.id');
            this.get('workflowTemplate').save().then((template) => {
              this.set('saving', false);
                 alert("zzz");
              NProgress.done();
              self.sendAction('setCyJson', self.get('cy').json());
              self.sendAction('makeDirty', false);
              // self.send('reloadPage');
              // self.set('workflowTemplate', template);
              // let steps = this.get('workflowTemplate').get('workflowTemplateSteps') || [];
              // this.set('steps', steps);
              self.send('showNotification', message);
              setTimeout(() => {
                self.sendAction('clean');
                if (newTemplate) {
                  self.get('router').replaceWith(
                    'app.templates.workflows.edit', template.get('id')
                  );
                } else {
                  window.location.reload();
                }
              }, 2000);
            }).catch((error) => {
              NProgress.done();
              self.set('saving', false);
              alert(error);
              self.send(
                'showNotification',
                'Sorry, There was a technical glitch in saving the template.',
              );
            });
          }
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
    reloadPage() {
      this.sendAction('reloadPage');
    },
    updateCommunication(step, name) {
      this.sendAction('makeDirty', true);
      const nodeId = this.get('selectedNode').data('id');
      this.set('communicationActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({ text: name });
      }, 100);
    },
    updateDocumentInfo(step, name) {
      this.sendAction('makeDirty', true);
      const nodeId = this.get('selectedNode').data('id');
      this.set('documentInfoActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({
          text: name, document_id: step.task_id,
        });
        if (step.task_id) {
          this.get('cy').$(`.${nodeId}`).addClass('document-has-document');
        } else {
          this.get('cy').$(`.${nodeId}`).removeClass('document-has-document');
        }
      }, 100);
    },
    updateDecision(step, name) {
      this.sendAction('makeDirty', true);
      const nodeId = this.get('selectedNode').data('id');
      this.set('decisionActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({ text: name });
      }, 100);
    },
    updateAction(step, name) {
      this.sendAction('makeDirty', true);
      const nodeId = this.get('selectedNode').data('id');
      this.set('actionActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({ text: name });
      }, 100);
    },
    updateStartStop(step, name) {
      this.sendAction('makeDirty', true);
      const nodeId = this.get('selectedNode').data('id');
      this.set('startStopActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
      setTimeout(() => {
        this.get('cy').$(`.${nodeId}`).data({ text: name });
      }, 100);
    },
    cancelCommunication() {
      this.set('communicationActive', false);
      this.set('selectedStep', null);
      this.set('selectedNode', null);
    },
    cancelDocumentInfo() {
      this.set('documentInfoActive', false);
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
    checkCharacter(){
      // console.log("am called");
      let description = this.get('workflowTemplate.description');
      if(description){
        let descriptionLength = description.length;
        let characterCount = 240;
        this.set('descriptionCharacterCount', characterCount - descriptionLength);
      }else{
        this.set('descriptionCharacterCount', 240);
      }
    },
    showWorkflowInformation() {
      this.set('workflowInstruction', true);
    },
  }
});

