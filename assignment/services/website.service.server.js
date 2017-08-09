module.exports = function(app, models){

    var websiteModel = models.websiteModel;

    //POST Calls
    app.post('/api/user/:uid/website',createWebsite);

    //GET Calls
    app.get('/api/user/:uid/website',findAllWebsitesForUser);
    app.get('/api/website/:wid',findWebsiteById);

    //PUT Calls
    app.put('/api/website/:wid',updateWebsite);

    //DELETE Calls
    app.delete('/api/website/:wid',deleteWebsite);


    function createWebsite(req, res) {
        var uid = req.params.uid;
        var website = req.body;

        websiteModel
            .createWebsiteForUser(uid, website)
            .then(
                function (website) {
                    if(website){
                        res.json(website);
                    } else {
                        website = null;
                        res.send(website);
                    }
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function findAllWebsitesForUser(req, res) {
        var uid = req.params.uid;

        websiteModel
            .findAllWebsitesForUser(uid)
            .then(
                function (websites) {
                    if(websites) {
                        res.json(websites);
                    } else {
                        websites = null;
                        res.send(websites);
                    }
                },
                function (error) {
                    res.sendStatus(400).send("website service server, findAllWebsitesForUser error");
                }
            )
    }

    function findWebsiteById(req, res) {
        var wid = req.params.wid;

        websiteModel
            .findWebsiteById(wid)
            .then(
                function (website) {
                    if(website) {
                        res.json(website);
                    } else {
                        website = null;
                        res.send(website);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function updateWebsite(req, res) {

        var wid = req.params.wid;
        var website = req.body;

        websiteModel
            .updateWebsite(wid, website)
            .then(
                function (website){
                    res.json(website)
                },
                function (error){
                    res.sendStatus(400).send("website service server, updateWebsite error");
                }
            );
    }

    function deleteWebsite(req, res) {
        var wid = req.params.wid;

        if(wid){
            websiteModel
                .deleteWebsite(wid)
                .then(
                    function (status){
                        res.sendStatus(200);
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        } else{
            res.sendStatus(412);
        }
    }
};