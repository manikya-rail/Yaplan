import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
	store: Ember.inject.service(),

	collaborators: null,
	isAddCollaboratorOpened: false,
	project: null,
	filterTrigger: false,
	isOpen: false,

	filterObserver: Ember.observer('project', function(){
		let filterTrigger = this.get('filterTrigger');
		this.set('filterTrigger', !filterTrigger);
	}),

	sourceObserver: Ember.observer('source', function(){
		// console.log("Source updated...");
		this.processData();
	}),

	processDataSource: function(){
		this.processData();
	}.on('didReceiveAttrs'),

	processData: function(){
		let componentContext = this;
		let dict_collaborator__doc = {};
		let docs = this.get('source');

		docs.forEach(function(doc){
			let plain_doc = doc.toJSON({includeId: true});

			for (var i in plain_doc.collaborators){
				let obj_collaborator = plain_doc.collaborators[i];
				if (dict_collaborator__doc[obj_collaborator.id] == null)
					dict_collaborator__doc[obj_collaborator.id] = {info: obj_collaborator, docs:[], projects:[], active: true};

				dict_collaborator__doc[obj_collaborator.id].docs.push({
					id : plain_doc.id,
					project_id: plain_doc.project_id,
					title: plain_doc.title
				});
				if (dict_collaborator__doc[obj_collaborator.id].projects.indexOf(plain_doc.project_id) == -1)
					dict_collaborator__doc[obj_collaborator.id].projects.push(plain_doc.project_id);
			}
		});

		let arr_collaborators = [];
		for (var id in dict_collaborator__doc){
			if (id == "undefined") continue;
			arr_collaborators.push(dict_collaborator__doc[id]);
		}

		this.set('collaborators', arr_collaborators);
		this.applyProjectFilter(this.get('project'));
	},

	applyProjectFilter: function(project){
		let collaborators = this.get('collaborators');

		if (project == null)
		{
			collaborators.forEach(function(collaborator){
				Ember.set(collaborator, 'active', true);
			});
			return;
		}
		collaborators.forEach(function(collaborator){
			//console.dir(collaborator.projects);
			if (collaborator.projects.contains(project.id*1))
				Ember.set(collaborator, 'active', true);
			else
				Ember.set(collaborator, 'active', false);
		});
	},

	actions: {
		changeProject: function(project){
			this.applyProjectFilter(project);
			this.set('project', project);
		},

		onSelectDocument: function(document_id){
			this.sendAction('onSelectDocument', document_id);
		},

		addCollaborator: function(){
			this.set('isAddCollaboratorOpened', true);
		},

		onCollaboratorInvited: function(){
			let componentContext = this;
			
			this.get('source').update().then(res => {
				componentContext.processData();
			});
		},

		onButtonClick: function(){
			this.toggleProperty('isOpen');
		}
	}
})