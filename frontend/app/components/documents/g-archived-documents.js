import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	router: Ember.inject.service('-routing'),
	users: Ember.inject.service(),
	documentinformation: null,
	linkedDocuments: null,
	time_zone: '',
	showDocs: false,
	infoDoc: false,
	showDocuments: true,
	showLoadingText: false,
	isTile: true,
	isList: false,
	totalDocuments: 0,
	totalPages: 0,
	createDoc: false,
	pages: null,
	page: 1,
	notification: {
		type: 0,
		msg: ''
	},
	sortProps: 'updatedAt',
	sortedDocs: Ember.computed.sort('archivedDocumentsList', function(doc1, doc2) {
		let result = 0;
		let item1, item2;
		switch (this.get('sortProps')) {
			case 'updatedAt':
				item1 = doc2.get('updatedAt');
				item2 = doc1.get('updatedAt');
				break;
			case 'title':
				item1 = doc1.get('title').toLowerCase();
				item2 = doc2.get('title').toLowerCase();
				break;
			case 'category':
				item1 = doc1.get('category_name').toLowerCase();
				item2 = doc2.get('category_name').toLowerCase();
				break;
			case 'project':
				item1 = doc1.get('project.title').toLowerCase();
				item2 = doc2.get('project.title').toLowerCase();
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

	didReceiveAttrs: function() {
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, function() {
			const self = this;
			if(this.get('page') == 1) {
				let meta = self.archivedDocumentsList.get('meta');
				self.set('totalDocuments', meta.total_records);
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

		isListdata() {
			this.toggleProperty('isTile');
			this.toggleProperty('isList');
		},

		isTiledata() {
			this.toggleProperty('isTile');
			this.toggleProperty('isList');
		},

		setSortProps(prop) {
			this.set('sortProps', prop);
			this.notifyPropertyChange('archivedDocumentsList');
		},

		showDocumentInfo(doc) {
			this.set('documentinformation', doc);
			this.toggleProperty('infoDoc');
		},

		showLinkedDcouments(documents) {
			this.set('linkedDocuments', documents);
			this.set('showDocs', true);
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
			store.query('document', { reload: true, page: pageNumber, q: query, archived: true }).then(function(res) {
				self.set('page', pageNumber);
				self.set('archivedDocumentsList', res);
				NProgress.done();
			})
		},

		searchDocuments(event) {
			const self = this;
			self.set('showText', false);
			self.set('showLoadingText', true);
			let store = this.get('store');
			let query = { q: event.target.value };
			self.set('page', 1);
			query.archived = true;
			query.page = 1;
			store.query('document', query).then(docs => {
				self.set('showLoadingText', false);
				self.set('archivedDocumentsList', docs);
			});
		},

		restoreDoc(doc) {
			NProgress.start();
      const self = this;
      $.ajax({
        type: "PUT",
        url: "v1/documents/" + doc.get('id') + "/unarchive",
        dataType: "text",
      }).done(function(data, statusText, xhr) {
        var status = xhr.status;
        if (status == '200') {
          NProgress.done();
          self.set('notification.type', 3);
          self.set('notification.msg', "Document was Restored");
          setTimeout(function() {
            self.set('notification.type', 0);
            self.get('router').transitionTo('app.documents');
          }, 2000);
        } else {
          NProgress.done();
          self.set('notification.type', 3);
          self.set('notification.msg', "Document couldn't be restored, Please try again");
          setTimeout(function() {
            self.set('notification.type', 0);
            self.get('router').transitionTo('app.documents.archiveddocuments');
          }, 2000);
        }
      });
		}

	}
});
