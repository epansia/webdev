module.exports = function(mongoose, userModel) {
    var websiteSchema = require('./website.schema.server.js')(mongoose);
    var websiteModel = mongoose.model('websiteModel', websiteSchema);

    var api = {
        'createWebsiteForUser': createWebsiteForUser,
        'findAllWebsitesForUser': findAllWebsitesForUser,
        'findWebsiteById': findWebsiteById,
        'updateWebsite': updateWebsite,
        'removePageFromWebsite': removePageFromWebsite,
        'deleteWebsite': deleteWebsite,
        'findAllWebsites' : findAllWebsites,
        'addPageToWebsite' : addPageToWebsite
    };

    return api;

    function createWebsiteForUser(userId, website) {
        website._user = userId;
        return websiteModel
            .create(website)
            .then(
                function (website) {
                    return userModel
                        .addWebsiteForUser(userId, website._id)
                });
    }

    function findAllWebsitesForUser(userId) {
        return websites = websiteModel
            .find({_user: userId})
            .populate('_user')
            .exec();
    }

    function findWebsiteById(websiteId) {
        return websiteModel.findOne({_id: websiteId});
    }

    function updateWebsite(websiteId, website) {
        return websiteModel.update({
            _id : websiteId
        }, {
            name: website.name,
            description: website.description
        });
    }

    function removePageFromWebsite(websiteId, pageId) {
        websiteModel
            .findOne({_id: websiteId})
            .then(
                function(website){
                    var index = website.pages.indexOf(pageId);
                    website.pages.splice(index, 1);
                    website.save();
                },
                function(error){
                    console.log(error);
                }
            );
    }

    function addPageToWebsite(websiteId, pageId) {
        return websiteModel
            .findOne({_id: websiteId})
            .then(function (website) {
                website.pages.push(pageId);
                return website.save();
            });
    }

    function deleteWebsite(websiteId) {
        return websiteModel
            .remove({_id: websiteId})
            .then(
                function (status) {
                    return userModel
                        .removeWebsiteFromUser(userId, websiteId);
                }
            );
    }

    function findAllWebsites() {
        return websiteModel.find();
    }


};