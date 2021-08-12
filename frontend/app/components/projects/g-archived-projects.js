import Ember from 'ember';

export default Ember.Component.extend({

	router: Ember.inject.service('-routing'),
	store: Ember.inject.service(),
	users: Ember.inject.service(),
	totalArchivedProjects: 0,
	session: Ember.inject.service(),
  	time_zone: '',
	totalPages: 0,
	pages: null,
	page: 1,
	sortProps: 'updatedAt',
	projectInfo: null,
  	showProjectInfo: false,
	archivedProjects: Ember.computed.sort('projectsList', function(project1, project2) {
		let result = 0;
		let item1, item2;
		switch (this.get('sortProps')) {
			case 'updatedAt':
				item1 = project2.get('updatedAt');
				item2 = project1.get('updatedAt');
				break;
			case 'title':
				item1 = project1.get('title').toLowerCase();
				item2 = project2.get('title').toLowerCase();
				break;
			case 'category':
				item1 = project1.get('category_name').toLowerCase();
				item2 = project2.get('category_name').toLowerCase();
				break;
		}
		if (item1 < item2) {
			result = -1;
		} else if (item1 > item2) {
			result = 1;
		} else {
			result = 0;
		}
		return result;
	}),
	isTile: true,
	isList: false,
	showMessage: false,
	notification: {
		type: 0,
		msg: ''
	},
	didReceiveAttrs: function() {
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, function() {
			const self = this;
			if(this.get('page') == 1) {
				let meta = self.projectsList.get('meta');
				self.set('totalArchivedProjects', meta.total_records);
				let totalRecords = meta.total_records;
				let no_of_pages =  Math.ceil(totalRecords/15);
				self.set('totalPages', no_of_pages);
				let pageArray = [];
				let count = 1;
				for(let i=1; i<=no_of_pages; i++){
					count++;
					if(count > 6) {
						break;
					} else {
						pageArray.push(i);
					}
				}
				self.set('pages', pageArray);
			}
			let ttime = self.get('users').getTimeZone();
    		self.set('time_zone', ttime);
		});
	},
	actions: {
		restoreProject(id) {
			NProgress.start();
			let self = this;
			$.ajax({
				type: "PATCH",
				url: "v1/projects/" + id + "/unarchive",
				data: {},
				success: function(data) {
					NProgress.done();
					self.set('notification.type', 3);
					self.set('notification.msg', "Project was Restored");
					setTimeout(function() {
						self.set('notification.type', 0);
						let store = self.get('store');
						store.query('project', { reload: true, archived: true, page: 1 }).then(function(res) {
							self.set('showMessage', false);
							self.set('projectsList', res);
							self.get('router').transitionTo('app.projects');
						});
					}, 2000);
				},
				failure: function(error) {
					NProgress.done();
					self.get('router').transitionTo('app.projects');
				}
			});
		},
		setSortProps(prop) {
			this.set('sortProps', prop);
			this.notifyPropertyChange('projectsList');
		},
		isListdata() {
			this.toggleProperty('isTile');
			this.toggleProperty('isList');
		},

		isTiledata() {
			this.toggleProperty('isTile');
			this.toggleProperty('isList');
		},

		searchProjects(evt) {
			const self = this;
			self.set('showMessage', true);
			let store = self.get('store');
			self.set('page', 1);
			store.query('project', { reload: true, archived: true, q: evt.target.value, page: 1 }).then(function(res){
				self.set('showMessage', false);
				self.set('projectsList', res);
			});
		},

		nextPage() {
			let page = this.get('page');
			this.set('page', page + 1);

			const self = this;
			let page_count = this.get('totalPages');
			if(page_count > 5) {
				let page_array = self.get('pages');
				let start = page_array[0] + 1;
				let count = 1;
				let pageArray = [];
				for(let i=start; i<=page_count; i++){
					count++;
					if(count > 6) {
						break;
					} else {
						pageArray.push(i);
					}
				}
				self.set('pages', pageArray);
			}

			this.send('callNext', this.get('page'));
		},

		prevPage() {
			this.set('page', this.get('page') - 1);

			const self = this;
			let page_count = this.get('totalPages');
			let page_array = self.get('pages');
			let count = 1;
			if(page_array[0] != 1) {
				let pageArray = [];
				let start = page_array[0] - 1;
				for(let i=start; i<=page_count; i++){
					count++;
					if(count > 6) {
						break;
					} else {
						pageArray.push(i);
					}
				}
				self.set('pages', pageArray);
			}

			this.send('callNext', this.get('page'));
		},

		callNext(pageNumber) {
			let store = this.get('store');
			let self = this;
			let query = $('#searchinput').val();
			NProgress.start();
			store.query('project', { archived: true, page: pageNumber, q: query, reload: true }).then(function(res) {
				self.set('page', pageNumber);
				self.set('projectsList', res);
				NProgress.done();
			})
		},

		projectInfo(project) {
	      this.set('projectInfo', project);
	      this.set('showProjectInfo', true);
    	}


	}

});