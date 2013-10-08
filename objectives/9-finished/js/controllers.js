App.ApplicationController = Ember.Controller.extend();

App.StoriesIndexController = Ember.ArrayController.extend({
  actions: {
    destroy: function(story) {
      story.deleteRecord();
      story.save();
    }
  }
});

App.StoriesModifyController = Ember.ObjectController.extend({
  actions: {
    cancel: function() {
      this.get("content").rollback();
      this.transitionToRoute("stories.index");
    }
  },
});

App.StoriesShowController = Ember.ObjectController.extend({
  needs: "application",

  actions: {
    edit: function() {
      if (this.get("controllers.application.currentPath") ===
          "stories.show.sections") {
        this.transitionToRoute("stories.edit.sections");
      } else {
        this.transitionToRoute("stories.edit");
      }
    }
  },

})

App.StoriesEditController = App.StoriesModifyController.extend({
  actions: {
    save: function() {
      this.get("content").save().then(
        this.didSave.bind(this)
      );
    }
  },

  didSave: function(story) {
    this.transitionToRoute("stories.show");
  }
});

App.StoriesNewController = App.StoriesModifyController.extend({
  actions: {
    create: function() {
      this.get("content").save().then(
        this.didCreate.bind(this)
      );
    }
  },

  didCreate: function(story) {
    this.transitionToRoute("stories.edit", story);
  }
});

App.ChoicesEditController = Ember.ArrayController.extend({
  actions: {
    remove: function(choice) {
      choice.deleteRecord();
      choice.save().then(this.didRemove.bind(this), this.didRejectRemove.bind(this));
    }
  },
  didRemove: function(choice) {
    choices = this.get("content")
    choices.removeObject(choice)
  },
  didRejectRemove: function(reason) {
    console.error("Failed to remove item", reason);
  }
});

App.StoriesEditSectionsController = Ember.ObjectController.extend();

App.ChoiceAddController = Ember.ObjectController.extend({
  needs: ["storiesEditSections","section-edit"],

  content: function() {
    return this.createChoiceObject();
  }.property(''),

  actions: {
    add: function() {
      choice = this.get("content");
      choice.set("goes_to", this.newSection());
      this.parentController().pushObject(choice);
      choice.save().then(this.didAdd.bind(this), this.didRejectAdd.bind(this));
    }
  },

  didAdd: function() {
    this.set("content", this.createChoiceObject());
  },

  didRejectAdd: function(reason) {
    console.error("reason");
  },

  createChoiceObject: function() {
    return this.get("store").createRecord('choice');
  },

  parentController: function() {
	section = this.get("controllers.storiesEditSections.choices");
	if (section === undefined) {
	  section = this.get("controllers.section-edit.choices");
	}
	return section;
  },

  newSection: function() {
    return this.get("store").createRecord('section');
  }

});

