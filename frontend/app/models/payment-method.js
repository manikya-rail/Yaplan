import DS from 'ember-data';

export default DS.Model.extend({
    card_number: DS.attr(),
    cvc: DS.attr(),
    exp_month: DS.attr(),
    exp_year: DS.attr(),
    country: DS.attr(),
    currency: DS.attr(),
    account_holder_name: DS.attr(),
    account_holder_type: DS.attr(),
    routing_number: DS.attr(),
    account_number: DS.attr(),
    method: DS.attr()
});
