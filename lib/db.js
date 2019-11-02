const fs = require('fs');
const Common = require('./common');

const _db = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: Common.DatabaseFilePath
  },
  useNullAsDefault: true
});

function initSettings(){

  _db("settings").where({key:"InitCompleted"}).then(function(rows){
    
    if( rows === undefined || rows.length == 0){
      var rsp = _db
      .insert({key:"InitCompleted", value:true})
      .into("settings")
      .then(function(){
          console.log("Insert completed.");
      });
    }
    else{
      console.log("settings init completed.");
    }
  });     
}

module.exports = {
  db : _db,
  setup : function(){
     
    _db.schema.hasTable('settings').then(function(exists) {
      if (!exists) {
        console.log("creating settings table");
        return _db.schema.createTable('settings', function(t) {
          t.increments('id').primary();
          t.timestamps(true,true);
          t.string('key', 100);
          t.string('value', 100000);
        }).then(function(){
          initSettings();
        });
      }
      else{
        console.log("settings table found");
      }
    });

    _db.schema.hasTable('home_page').then(function(exists) {
      if (!exists) {
        console.log("creating HomePage table");
        return _db.schema.createTable('home_page', function(t) {
          t.increments('id').primary();
          t.timestamps(true,true);
          t.string('type', 100);
          t.string('data', 100000);
          t.integer("max_shortcuts",10);
        }).then(function(){
          console.log("HomePage created");
        });
      }
      else{
        console.log("HomePage table found");
      }
    });

    _db.schema.hasTable('home_shortcuts').then(function(exists) {
      if (!exists) {
        console.log("creating HomeShourtcuts table");
        return _db.schema.createTable('home_shortcuts', function(t) {
          t.increments('id').primary();
          t.timestamps(true,true);
          t.integer('site_id', 10);
          t.integer('visit_count', 20);          
        }).then(function(){
          console.log("HomeShortcuts created");
        });
      }
      else{
        console.log("settings table found");
      }
    });

    _db.schema.hasTable('history').then(function(exists) {
      if (!exists) {
        console.log("creating History table");
        return _db.schema.createTable('history', function(t) {
          t.increments('id').primary();
          t.timestamps(true,true);
          t.integer("user_id",10);
          t.string("session_id",50);
          t.integer('site_id', 10);
          t.string("url",500);
          t.string("title",500);
          t.integer('window_number', 10);
          t.integer('tab_index', 10);
          t.integer('state', 10); /* Open, Pinned, Cloased */
          t.integer('is_mute', 10);
          t.integer('count', 10);
        }).then(function(){
          console.log("History created");
        });
      }
      else{
        console.log("History table found");
      }
    });
    
    _db.schema.hasTable('site').then(function(exists) {
      if (!exists) {
        console.log("creating Site table");
        return _db.schema.createTable('site', function(t) {
          t.increments('id').primary();
          t.timestamps(true,true);
          t.integer('zoom', 10);
          t.string("domain",100);
          t.string("favicon",500);
          t.integer("status",10);
        }).then(function(){
          console.log("Site created");
        });
      }
      else{
        console.log("Site table found");
      }
    });

    _db.schema.hasTable('download').then(function(exists) {
      if (!exists) {
        console.log("creating Download table");
        return _db.schema.createTable('download', function(t) {
          t.increments('id').primary();
          t.timestamps(true,true);
          t.integer('status', 10);
          t.dateTime('download_date');
          t.string("url",500);
          t.string("save_path",500);

        }).then(function(){
          console.log("Download created");
        });
      }
      else{
        console.log("Download table found");
      }
    });

    _db.schema.hasTable('bookmark_folder').then(function(exists) {
      if (!exists) {
        console.log("creating bookmark_folder table");
        return _db.schema.createTable('bookmark_folder', function(t) {
          t.increments('id').primary();
          t.timestamps(true,true);
          t.integer("user_id",10);          
          t.integer('parent_id', 10);
          t.string("name",500);
          t.boolean("is_bookmark_bar");
        }).then(function(){
          console.log("bookmark_folder created");
        });
      }
      else{
        console.log("bookmark_folder table found");
      }
    });

    _db.schema.hasTable('bookmark_site').then(function(exists) {
      if (!exists) {
        console.log("creating bookmark_site table");
        return _db.schema.createTable('bookmark_site', function(t) {
          t.increments('id').primary();
          t.timestamps(true,true);
          t.integer("user_id",10);          
          t.integer('site_id');
          t.integer('folder_id', 10);
          t.string("title",500);
          t.string("url",500);
          t.boolean("is_bookmark_bar");
        }).then(function(){
          console.log("bookmark_site created");
        });
      }
      else{
        console.log("bookmark_site table found");
      }
    });

  },  
  settings: {
    set: function(key, value){
        _db("settings").insert({key:key, value:value, created_at:new Date(), updated_at:new Date()}).then(function(rsp){
          console.log(rsp);
          return rsp;
        });
    },
    get: function (key){
      _db("settings")
      .where({key:key})
      .then(function(rows){
        return rows[0];
      });
    },
    loadAll(){
      return _db.from("settings").select("*");
    }
  },
  history:{
    loadAllUrl:function(){
      return _db.from("history").select("url");
    }
  }
}
