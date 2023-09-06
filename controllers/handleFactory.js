const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError("No tour found with that ID", 404));
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError("No document found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: {
                doc,
            },
        });
    });

exports.toggleActive = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError("No document found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: {
                doc,
            },
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const document = await Model.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                data: document,
            },
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        
        // let filter = {};
        // if (req.params.id) filter = { active: true,_id: };

        // const currentTour = Model.find({ _id: req.params.id });

        // let query = Model.findById(req.params.id);
        const features = new APIFeatures(
            Model.findById(req.params.id),
            req.query
        )
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const document = await features.query;
        // if (popOptions) query = query.populate(popOptions);
        // const document = await query;

        if (!document) {
            return next(new AppError("No tour found with that ID", 404));
        }
        res.status(200).json({
            status: "success",
            data: {
                data: document[0],
            },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        let filter = {};
        if (req.params.id) filter = { active: true };
   
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const count = new APIFeatures(Model.find(filter), req.query).counter();
        
        let doc, total;
        await Promise.all([features.query, count]).then((values) => {
            doc = values[0];
            total = values[1];
        });
        
        
        res.status(200).json({
            status: "success",
            total,
            page: parseInt(req.query.page),
            limit: parseInt(req.query.limit),
            results: doc.length,
            data: {
                data: doc,
            },
        });
    });
