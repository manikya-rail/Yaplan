let get = Ember.get;
import * as _ from 'lodash';
let camelize = Ember.String.camelize;
let pluralize = new Ember.Inflector();

export default Ember.Mixin.create({

    /**
      Serialize `belongsTo` relationship when it is configured as an embedded object.

      This example of an author model belongs to a post model:

      ```js
      Post = DS.Model.extend({
        title:    DS.attr('string'),
        body:     DS.attr('string'),
        author:   DS.belongsTo('author')
      });

      Author = DS.Model.extend({
        name:     DS.attr('string'),
        post:     DS.belongsTo('post')
      });
      ```

      Use a custom (type) serializer for the post model to configure embedded author

      ```js
      App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          author: {embedded: 'always'}
        }
      })
      ```

      A payload with an attribute configured for embedded snapshot.records can serialize
      the snapshot.records together under the root attribute's payload:

      ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "author": {
            "id": "2"
            "name": "dhh"
          }
        }
      }
      ```

      @method serializeBelongsTo
      @param {DS.Model} snapshot.record
      @param {Object} json
      @param {Object} relationship
    */
    serializeBelongsTo: function(snapshot, json, relationship) {
      let attr = relationship.key;
      let attrs = this.get('attrs');
      if (noSerializeOptionSpecified(attrs, attr)) {
        this._super(snapshot, json, relationship);
        return;
      }
      let includeIds = hasSerializeIdsOption(attrs, attr);
      let includeRecords = hasSerializeRecordsOption(attrs, attr);
      let embeddedRecord = snapshot.record.get(attr);
      if (includeIds) {
        key = this.keyForRelationship(attr, relationship.kind);
        if (!embeddedRecord) {
          json[key] = null;
        } else {
          json[key] = get(embeddedRecord, 'id');
        }
      } else if (includeRecords) {
        let key = this.keyForRelationship(attr);
        let embeddedKey = this.formatEmbeddedKey(key);
        if (!embeddedRecord) {
          json[key] = null;
        } else {
          json[embeddedKey] = embeddedRecord.serialize({includeId: true});
          this.removeEmbeddedForeignKey(snapshot, embeddedRecord, relationship, json[embeddedKey]);
        }
      }
    },

    formatEmbeddedKey: function(key){
      return key + "_attributes";
    },

    /**
      Serialize `hasMany` relationship when it is configured as embedded objects.

      This example of a post model has many comments:

      ```js
      Post = DS.Model.extend({
        title:    DS.attr('string'),
        body:     DS.attr('string'),
        comments: DS.hasMany('comment')
      });

      Comment = DS.Model.extend({
        body:     DS.attr('string'),
        post:     DS.belongsTo('post')
      });
      ```

      Use a custom (type) serializer for the post model to configure embedded comments

      ```js
      App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          comments: {embedded: 'always'}
        }
      })
      ```

      A payload with an attribute configured for embedded snapshot.records can serialize
      the snapshot.records together under the root attribute's payload:

      ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "body": "I want this for my ORM, I want that for my template language..."
          "comments": [{
            "id": "1",
            "body": "Rails is unagi"
          }, {
            "id": "2",
            "body": "Omakase O_o"
          }]
        }
      }
      ```

      The attrs options object can use more specific instruction for extracting and
      serializing. When serializing, an option to embed `ids` or `snapshot.records` can be set.
      When extracting the only option is `snapshot.records`.

      So `{embedded: 'always'}` is shorthand for:
      `{serialize: 'snapshot.records', deserialize: 'snapshot.records'}`

      To embed the `ids` for a related object (using a hasMany relationship):

      ```js
      App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          comments: {serialize: 'ids', deserialize: 'snapshot.records'}
        }
      })
      ```

      ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "body": "I want this for my ORM, I want that for my template language..."
          "comments": ["1", "2"]
        }
      }
      ```

      @method serializeHasMany
      @param {DS.Model} snapshot.record
      @param {Object} json
      @param {Object} relationship
    */
    serializeHasMany: function(snapshot, json, relationship) {
      let attr = relationship.key;
      let attrs = this.get('attrs');
      if (noSerializeOptionSpecified(attrs, attr)) {
        this._super(snapshot, json, relationship);
        return;
      }
      let includeIds = hasSerializeIdsOption(attrs, attr);
      let includeRecords = hasSerializeRecordsOption(attrs, attr);
      let key;
      if (includeIds) {
        key = this.keyForRelationship(attr, relationship.kind);
        json[key] = get(snapshot, attr).mapBy('id');
      } else if (includeRecords) {
        key = this.keyForAttribute(attr);
        let embeddedKey = formatEmbeddedKey(key);
        json[embeddedKey] = get(snapshot, attr).map(function(embeddedRecord) {
          let serializedEmbeddedRecord = embeddedRecord.serialize({includeId: true});
          this.removeEmbeddedForeignKey(snapshot, embeddedRecord, relationship, serializedEmbeddedRecord);
          return serializedEmbeddedRecord;
        }, this);
      }
    },

    /**
      When serializing an embedded snapshot.record, modify the property (in the json payload)
      that refers to the parent snapshot.record (foreign key for relationship).

      Serializing a `belongsTo` relationship removes the property that refers to the
      parent snapshot.record

      Serializing a `hasMany` relationship does not remove the property that refers to
      the parent snapshot.record.

      @method removeEmbeddedForeignKey
      @param {DS.Model} snapshot.record
      @param {DS.Model} embeddedRecord
      @param {Object} relationship
      @param {Object} json
    */
    removeEmbeddedForeignKey: function (snapshot, embeddedRecord, relationship, json) {
      if (relationship.kind === 'hasMany') {
        return;
      } else if (relationship.kind === 'belongsTo') {
        let parentRecord = snapshot.record.constructor.inverseFor(relationship.key);
        if (parentRecord) {
          let name = parentRecord.name;
          let embeddedSerializer = this.store.serializerFor(embeddedRecord.constructor);
          let parentKey = embeddedSerializer.keyForRelationship(name, parentRecord.kind);
          if (parentKey) {
            delete json[parentKey];
          }
        }
      }
    },

    /**
      Extract an embedded object from the payload for a single object
      and add the object in the compound document (side-loaded) format instead.

      A payload with an attribute configured for embedded snapshot.records needs to be extracted:

      ```js
      {
        "post": {
          "id": 1
          "title": "Rails is omakase",
          "author": {
            "id": 2
            "name": "dhh"
          }
          "comments": []
        }
      }
      ```

      Ember Data is expecting a payload with a compound document (side-loaded) like:

      ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "author": "2"
          "comments": []
        },
        "authors": [{
          "id": "2"
          "post": "1"
          "name": "dhh"
        }]
        "comments": []
      }
      ```

      The payload's `author` attribute represents an object with a `belongsTo` relationship.
      The `post` attribute under `author` is the foreign key with the id for the post

      @method extractSingle
      @param {DS.Store} store
      @param {subclass of DS.Model} primaryType
      @param {Object} payload
      @param {String} snapshot.recordId
      @return Object the primary response to the original request
    */
    extractSingle: function(store, primaryType, payload, recordId) {
      let root = this.keyForAttribute(primaryType.typeKey),
          partial = payload[root];

      updatePayloadWithEmbedded(this, store, primaryType, payload, partial);

      return this._super(store, primaryType, payload, recordId);
    },

    /**
      Extract embedded objects in an array when an attr is configured for embedded,
      and add them as side-loaded objects instead.

      A payload with an attr configured for embedded snapshot.records needs to be extracted:

      ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "comments": [{
            "id": "1",
            "body": "Rails is unagi"
          }, {
            "id": "2",
            "body": "Omakase O_o"
          }]
        }
      }
      ```

      Ember Data is expecting a payload with compound document (side-loaded) like:

      ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "comments": ["1", "2"]
        },
        "comments": [{
          "id": "1",
          "body": "Rails is unagi"
        }, {
          "id": "2",
          "body": "Omakase O_o"
        }]
      }
      ```

      The payload's `comments` attribute represents snapshot.records in a `hasMany` relationship

      @method extractArray
      @param {DS.Store} store
      @param {subclass of DS.Model} primaryType
      @param {Object} payload
      @return {Array<Object>} The primary array that was returned in response
        to the original query.
    */
    extractArray: function(store, primaryType, payload) {
      let root = this.keyForAttribute(primaryType.typeKey),
          partials = payload[pluralize(root)];

      _.forEach(partials, function(partial) {
        updatePayloadWithEmbedded(this, store, primaryType, payload, partial);
      }, this);

      return this._super(store, primaryType, payload);
    }
  });

  // checks config for attrs option to embedded (always) - serialize and deserialize
  function hasEmbeddedAlwaysOption(attrs, attr) {
    let option = attrsOption(attrs, attr);
    return option && option.embedded === 'always';
  }

  // checks config for attrs option to serialize ids
  function hasSerializeRecordsOption(attrs, attr) {
    let alwaysEmbed = hasEmbeddedAlwaysOption(attrs, attr);
    let option = attrsOption(attrs, attr);
    return alwaysEmbed || (option && (option.serialize === 'snapshot.records'));
  }

  // checks config for attrs option to serialize snapshot.records
  function hasSerializeIdsOption(attrs, attr) {
    let option = attrsOption(attrs, attr);
    return option && (option.serialize === 'ids' || option.serialize === 'id');
  }

  // checks config for attrs option to serialize snapshot.records
  function noSerializeOptionSpecified(attrs, attr) {
    let option = attrsOption(attrs, attr);
    let serializeRecords = hasSerializeRecordsOption(attrs, attr);
    let serializeIds = hasSerializeIdsOption(attrs, attr);
    return !(option && (option.serialize || option.embedded));
  }

  // checks config for attrs option to deserialize snapshot.records
  // a defined option object for a resource is treated the same as
  // `deserialize: 'snapshot.records'`
  function hasDeserializeRecordsOption(attrs, attr) {
    let alwaysEmbed = hasEmbeddedAlwaysOption(attrs, attr);
    let option = attrsOption(attrs, attr);
    let hasSerializingOption = option && (option.deserialize || option.serialize);
    return alwaysEmbed || hasSerializingOption /* option.deserialize === 'snapshot.records' */;
  }

  function attrsOption(attrs, attr) {
    return attrs && (attrs[Ember.String.camelize(attr)] || attrs[attr]);
  }

  // chooses a relationship kind to branch which function is used to update payload
  // does not change payload if attr is not embedded
  function updatePayloadWithEmbedded(serializer, store, type, payload, partial) {
    let attrs = get(serializer, 'attrs');

    if (!attrs) {
      return;
    }
    type.eachRelationship(function(key, relationship) {
      if (hasDeserializeRecordsOption(attrs, key)) {
        if (relationship.kind === "hasMany") {
          updatePayloadWithEmbeddedHasMany(serializer, store, key, relationship, payload, partial);
        }
        if (relationship.kind === "belongsTo") {
          updatePayloadWithEmbeddedBelongsTo(serializer, store, key, relationship, payload, partial);
        }
      }
    });
  }

  // handles embedding for `hasMany` relationship
  function updatePayloadWithEmbeddedHasMany(serializer, store, primaryType, relationship, payload, partial) {
    let embeddedSerializer = store.serializerFor(relationship.type.typeKey);
    let primaryKey = get(serializer, 'primaryKey');
    let attr = relationship.type.typeKey;
    // underscore forces the embedded snapshot.records to be side loaded.
    // it is needed when main type === relationship.type
    let embeddedTypeKey = '_' + serializer.typeForRoot(relationship.type.typeKey);
    let expandedKey = serializer.keyForRelationship(primaryType, relationship.kind);
    let attribute  = serializer.keyForAttribute(primaryType);
    let ids = [];

    if (!partial[attribute]) {
      return;
    }

    payload[embeddedTypeKey] = payload[embeddedTypeKey] || [];

    _.forEach(partial[attribute], function(data) {
      let embeddedType = store.modelFor(attr);
      updatePayloadWithEmbedded(embeddedSerializer, store, embeddedType, payload, data);
      ids.push(data[primaryKey]);
      payload[embeddedTypeKey].push(data);
    });

    partial[expandedKey] = ids;
    delete partial[attribute];
  }

  // handles embedding for `belongsTo` relationship
  function updatePayloadWithEmbeddedBelongsTo(serializer, store, primaryType, relationship, payload, partial) {
    let attrs = serializer.get('attrs');

    if (!attrs ||
      !(hasDeserializeRecordsOption(attrs, Ember.String.camelize(primaryType)) ||
        hasDeserializeRecordsOption(attrs, primaryType))) {
      return;
    }
    let attr = relationship.type.typeKey;
    let _serializer = store.serializerFor(relationship.type.typeKey);
    let primaryKey = get(_serializer, 'primaryKey');
    let embeddedTypeKey = Ember.String.pluralize(attr); // TODO don't use pluralize
    let expandedKey = _serializer.keyForRelationship(primaryType, relationship.kind);
    let attribute = _serializer.keyForAttribute(primaryType);

    if (!partial[attribute]) {
      return;
    }
    payload[embeddedTypeKey] = payload[embeddedTypeKey] || [];
    let embeddedType = store.modelFor(relationship.type.typeKey);
    // Recursive call for nested snapshot.record
    updatePayloadWithEmbedded(_serializer, store, embeddedType, payload, partial[attribute]);
    partial[expandedKey] = partial[attribute].id;
    // Need to move an embedded `belongsTo` object into a pluralized collection
    payload[embeddedTypeKey].push(partial[attribute]);
    // Need a reference to the parent so relationship works between both `belongsTo` snapshot.records
    partial[attribute][relationship.parentType.typeKey + '_id'] = partial.id;
    delete partial[attribute];
  }