// This code only runs on the client
Meteor.subscribe("subjects");
Meteor.subscribe("hacknights");

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function () {
      this.render('home');
});

Router.route('/admin', function () {
      this.render('admin');
});

Router.route('/results', function () {
      this.render('results');
});

Template.admin.events({
    "click .ultimate_button": function (event) {
        console.log('blah');
      // This function is called when the new task form is submitted

      Meteor.call("addHackNight");
        console.log('blah2');
      // Prevent default form submit
      return false;
    }
});

Template.team.helpers({
    members: function () {
        return this;
    }
});
Template.group.helpers({
    memberCount: function () {
        // If hide completed is checked, filter tasks
        if(!this) return null;
        return this.length;
    }, 
    members: function () {
        return this;
    }
});


Template.results.helpers({
    groups: function () {
        // If hide completed is checked, filter tasks
        var hacknight =  HackNights.findOne({}, {sort: {createdAt: -1}});
        if(hacknight && hacknight.groups) {
            var groups = [];
            _.each(hacknight.groups, function(val, key) {
                groups.push({ subject: key, 
                              teams: val});
            });
            return groups;
        } else {
            return null;
        }
    }
});


Template.home.helpers({
    subjects: function () {
        // If hide completed is checked, filter tasks
        return Subjects.find({});
    },
    thing: function() {

       var user = Meteor.user();
       if(!user) return;

       return user.profile.subject;

    }
});

Template.home.events({
    "submit .new-subject": function (event) {
        console.log('blah');
      // This function is called when the new task form is submitted
      var text = event.target.text.value;

      Meteor.call("addSubject", text);
        console.log('blah2');

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
});

Template.subject.events({
    "click .subject_item": function (e, t) {
        var user = Meteor.user();
        Meteor.users.update({_id: user._id}, { $set: {'profile.subject': this.title }});
    }
});

Template.subject.helpers({
    isSelected: function () {
        var user = Meteor.user();
        if(!user || !user.profile) return "";
        if(!user.profile.subject) return null;
      return this.title === user.profile.subject;
    }
});

Accounts.ui.config({
});


