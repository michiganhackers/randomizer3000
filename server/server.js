ServiceConfiguration.configurations.remove({
      service: "facebook"
});
ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: "1542129969403023",
      loginStyle: "redirect",
      secret: "866a87832b07eb3f06335de04df35254"
});



Meteor.methods({
  addHackNight: function () {
    // Make sure the user is logged in before inserting a task
        console.log('blah3');
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    subjects = Subjects.find({}).fetch();

    console.log(subjects);
    var groups = {}

    for(var i = 0; i < subjects.length; i++) {


        var subject_title = subjects[i].title;


        people = Meteor.users.find({ 'profile.subject' : subject_title}).fetch();
        if(!people.length) {
            console.log( 'no people!');
            continue;
        }

        groups[subject_title] = [];

        var odd = people.length % 2;
        var num_groups = Math.floor(people.length / 2);

        var results = groups[subject_title];

        if(people.length < 2) num_groups = 1;

        for(var j = 0; j < num_groups; j++) {
            results.push({"team_num": j + 1, "members": []});
        }
        for(var k = 0; k < people.length; k++) {
            var index = Math.floor((Math.random() * num_groups));
            if(!results[index]) continue;
            while((results[index].length > 1 && !odd) || (results[index].length > 2) && odd) {
                index = Math.floor((Math.random() * num_groups));
            }
            results[index]["members"].push(people[k].profile.name);
        }
        
        groups[subject_title] = results;
    }
    
    HackNights.insert({
        groups: groups,
        createdAt: new Date()
    });
  },


  addSubject: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

        
    Subjects.insert({
      title: text
    });
    /*
    , {
        upsert: true
    });
    */
    var user = Meteor.user();
    Meteor.users.update({_id: user._id}, { $set: {'profile.subject': text }});
  },
  deleteSubject: function (subjectId) {
    var subject = Subjects.findOne(subjectId);
    if (subject.private && subject.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Subjects.remove(subjectId);
  }
});

// Only publish tasks that are public or belong to the current user
Meteor.publish("subjects", function () {
    return Subjects.find({});
});

Meteor.publish("hacknights", function () {
    return HackNights.find({});
});

