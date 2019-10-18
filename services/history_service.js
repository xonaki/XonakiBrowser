var _db = require("../lib/db").db;
var _util = require("../lib/common");

module.exports = {
     
    save: function(entity){
        _db("history").insert(entity).then(function(rsp){
            console.log(rsp);
            return rsp;
        });
    },
    get: function (id){
        _db("history")
        .where({Id:id})
        .then(function(rows){
        return rows[0];
        });
    },
    find: function(url){
        _db("history")
        .where({url:url})
        .then(function(rows){
        return rows[0];
        });
    },
    load_all: function(){
        return _db.from("history").select("*");
    },
    save_or_update: function(url){
        
        var domain = _util.get_domain_from_url(url);
        
        _db("site")
        .where({domain:domain}).then(function(rows){
            
            if(rows.length > 0){
                
                var site = rows[0];                
                var date = new Date().toISOString().slice(0, 10);
                
                _db("history")
                .where({site_id:site.id, url:url})
                .whereRaw("created_at >= ?", date)
                .then(function(hRows){

                    if(hRows.length > 0){
                        var history = hRows[0];                            
                        _db("history")
                        .where({id:history.id})
                        .update({count:history.count + 1, updated_at: _util.get_current_date_time()}).then(function(rsp){            
                            return rsp;
                        });
                    }
                    else{
                        _db("history").insert({url:url, site_id:site.id, count:1}).then(function(rsp){            
                            return rsp;
                        });
                    }
                });
            }
            else{
                _db("site").insert({domain:domain, zoom:100, status:1}).then(function(site){
                    _db("history").insert({url:url, site_id:site.id, count:1}).then(function(rsp){            
                        return rsp;
                    });
                });
            }
        });        
    }
}