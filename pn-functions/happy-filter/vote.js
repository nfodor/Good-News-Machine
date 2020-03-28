export default (request, response) => {
    const kvstore = require('kvstore');
    const pubnub = require('pubnub');

    let paramsObject = request.params;
    console.log('request', request); // Log the request envelope passed

    if (paramsObject.voteid == "undefined") {
 		console.log("request with no voteid");
        response.status = 400;
        return response.send("Missing voteid.");
    }

   	return kvstore.get(paramsObject.voteid).then((value) => {
        kvstore.set(paramsObject.voteid, { 
        	votes:(value.votes+1) // Count vote
        });
        pubnub.publish({ message: "+1", channel: paramsObject.voteid }); // Stream new votes so dashboards can keep a real time count.
        response.status = 200;
		return response.send("Vote accepted."); // (: 
	}).catch((error) => {
        console.log(error);
        response.status = 400;
        return response.send("VoteID not found.");
    });                             
};