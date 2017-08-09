module.exports = function(app, models){

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });

    var widgetModel = models.widgetModel;

    // POST call
    app.post("/api/page/:pid/widget", createWidget);

    // GET call
    app.get("/api/page/:pid/widget", findAllWidgetsForPage);
    app.get("/api/widget/:wgid", findWidgetById);

    // PUT call
    app.put("/api/widget/:wgid", updateWidget);

    // DELETE call
    app.delete("/api/widget/:wgid", deleteWidget);

    // upload image
    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    // reorder widget list
    app.put("/api/page/:pid/widget", reorderWidgets);

    // api implementation

    function createWidget(req, res) {
        var pid = req.params.pid;
        var widget = req.body;

        widgetModel
            .createWidget(pid, widget)
            .then(
                function (widget) {
                    if(widget){
                        res.json(widget);
                    } else {
                        widget = null;
                        res.send(widget);
                    }
                }
                ,
                function (error) {
                    res.sendStatus(400).send("widget service server, createWidget error");
                }
            )
    }

    function findAllWidgetsForPage(req, res) {
        var pid = req.params.pid;
        widgetModel
            .findAllWidgetsForPage(pid)
            .then(
                function (widgets) {
                    if(widgets) {
                        res.json(widgets);
                    } else {
                        widgets = null;
                        res.send(widgets);
                    }
                }, function (error) {
                    res.sendStatus(400).send("widget service server, findAllWidgetsForPage error");
                }
            )
    }

    function findWidgetById(req, res) {
        var wgid = req.params.wgid;

        widgetModel
            .findWidgetById(wgid)
            .then(
                function (widget) {
                    if (widget) {
                        res.json(widget);
                    } else {
                        widget = null;
                        res.send(widget);
                    }
                },
                function (error) {
                    res.sendStatus(400).send("widget service server, findWidgetById error");
                }
            );
    }

    function updateWidget(req, res) {

        var wgid = req.params.wgid;
        var widget = req.body;
        widgetModel
            .updateWidget(wgid, widget)
            .then(
                function (widget) {
                    res.json(widget);
                },
                function (error) {
                    res.status(400).send("widget service server, updateWidget error");
                }
            );
    }

    function deleteWidget(req, res) {
        var wgid = req.params.wgid;
        if(wgid){
            widgetModel
                .deleteWidget(wgid)
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

    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    function uploadImage(req, res) {

        var widgetId      = req.body.widgetId;
        var width         = req.body.width;

        var myFile        = req.file;

        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var url = 'uploads/'+filename;

        // when try to create a new image
        if (widgetId === undefined || widgetId === null || widgetId === '') {
            var widget = {
                widgetType: "IMAGE",
                url: url,
                width: width
            };

            widgetModel
                .createWidget(pageId, widget)
                .then(
                    function (widget) {
                        if(widget){
                            res.json(widget);
                        } else {
                            widget = null;
                            res.send(widget);
                        }
                    }
                    ,
                    function (error) {
                        res.sendStatus(400).send("widget service server, upload error");
                    }
                )
        } else {
            // when trying to edit existing image
            widgetModel
                .findWidgetById(widgetId)
                .then(
                    function (widget) {
                        widget.url = url;
                        model.updateWidget(widgetId, widget)
                            .then(
                                function (widget) {
                                    res.json(widget);
                                },
                                function (error) {
                                    res.status(400).send("widget service server, updateWidget error");
                                }
                            )
                    },
                    function (error) {
                        res.status(400).send("Cannot find widget by id");
                    }
                )

        }

        var callbackUrl  = "/#!/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget";
        res.redirect(callbackUrl);
    }

    function reorderWidgets(req, res) {
        var pid = req.params.pid;

        var index1 = req.query.start;
        var index2 = req.query.end;

        widgetModel
            .reorderWidgets(pid, index1, index2)
            .then(
                function (status) {
                res.send(status);
                },
                function (error) {
                    res.status(400).send("Cannot reorder widgets");
                }
            );

    }

};