import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    NProgress.start();
  },
  model() {
    return Ember.RSVP.hash({
      archivedProjects: this.store.query(
        'project', { reload: true, archived: true, page: 1 }
      ),
    })
  },
  afterModel() {
    NProgress.done();
  },
});
