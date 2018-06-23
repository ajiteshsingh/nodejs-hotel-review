var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res){
    var lat = parseFloat(req.query.lng);
    var lng = parseFloat(req.query.lat);
    
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };
    
    var geoOptions = {
        spherical : true,
        maxDistance : 2000,
        num : 5
    };
    
    
    Hotel.aggregate().near({ 
  near: 
  {
   'type': 'Point',
    'coordinates': [parseFloat(req.query.lng), parseFloat(req.query.lat)] }, 
    maxDistance: 100000, 
    spherical: true, 
    distanceField: "dis" 
   }
   ).then(function(results){
   res.json(results);
    });

}
module.exports.hotelsGetAll = function(req, res){
    
    
    var offset = 0;
    var count = 5;
    var maxcount = 10;
    if(req.query && req.query.lat && req.query.lng){
        runGeoQuery(req, res);
        return;
    }
    
    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, 10);
    }
    
    if(req.query && req.query.count){
        count = parseInt(req.query.count, 10);
    }
    
    if(isNaN(offset) || isNaN(count)){
        console.log("Offset and count should be a number in the querystring");
        res.status(400).json({
            "message": "Please enter a valid querystring"
        });
        return;
    }
    
    if(count > maxcount){
        res.status(400).json({"message":"Count should be less than "+ maxcount});
        return;
    }
    
    Hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, hotels){
        if(err){
            res.status(500).json(err);
        }else{
            console.log("Found hotels", hotels);
            res.json(hotels);
        }
        
    });
    
    
};

module.exports.hotelsGetOne = function(req, res){
    

    
    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);
    Hotel
        .findById(hotelId)
        .exec(function(err, doc){
        if(err){
            res.status(500).json(err);
        }else if(!doc){
            res.status(404).json({"message":"Document you are searching for is not found"});
        }else{
            res
            .status(200)
            .json(doc);
        }
        
    }); 
    
    
};

var _splitArray = function(input){
    var output;
    if(input && input.length > 0){
        output = input.split(";");
    }else{
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function(req, res){
    
    Hotel
        .create({
        name : req.body.name,
        description : req.body.description,
        stars : parseInt(req.body.stars, 10),
        services : _splitArray(req.body.services),
        photos : _splitArray(req.body.photos),
        currency : req.body.currency,
        location : {
            address : req.body.address,
            coordinates:[
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
            ]
        }
    },function(err, hotel){
        if(err){
            console.log("Error creating hotel");
            res.status(400).json(err);
        }else{
            console.log("Hotel created", hotel);
            res.status(201).json(hotel);
        }
    });
    
};

module.exports.hotelsUpdateOne = function(req, res){
    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);
    Hotel
        .findById(hotelId)
        .select("-reviews -rooms")
        .exec(function(err, doc){
        
        var response = {
            status : 200,
            message : doc
        };
        if(err){
            console.log("Error finding hotel");
            response.status = 500;
            response.message = err;
            
        }else if(!doc){
          
      
            response.status = 400;
            response.message = {
                "message" : "Hotel ID not found"
            };
            
        }
        if(response.status !== 200){
            res.status(response.status)
            .json(response.message);
        }else{
            doc.name = req.body.name;
            doc.description = req.body.description;
        doc.stars = parseInt(req.body.stars, 10);
        doc.services = _splitArray(req.body.services);
        doc.photos = _splitArray(req.body.photos);
        doc.currency = req.body.currency;
        doc.location = {
            address : req.body.address,
            coordinates:[
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
            ]
        };
            
            doc.save(function(err, hotelUpdated){
                if(err){
                    res.status(500).json(err);
                }else{
                    res.status(204).json();
                }
            });
            
            
        }
        
    }); 
    
    
};


module.exports.hotelsDeleteOne = function(req, res){
    var hotelId = req.params.hotelId;
    
    Hotel
    .findByIdAndRemove(hotelId)
    .exec(function(err, hotel){
            if(err){
                res.status(404).json(err);
            }else{
                console.log("Hotel Deleted ", hotelId);
                res.status(204).json();
            }
          });
};

