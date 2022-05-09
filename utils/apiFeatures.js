class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        if (queryObj.primaryCategory)
            queryObj.primaryCategory = queryObj.primaryCategory.split(",");

        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1B) ADVANCED FILTERING WITH SUPPORT OF lt,gt,gte etc in query url
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lt|lte)\b/g,
            (match) => `$${match}`
        );
        this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        // 2 SORTING 127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage (-ve for descending order)
        if (this.queryString.sort) {
            console.log(this.queryString.sort);
            this.query = this.query.sort(
                this.queryString.sort.split(",").join(" ")
            ); // (split join) as sort method needs a string like 'price ratingsAverage'
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    limitFields() {
        // 3) Field Limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }
    counter() {
        const queryObj = { ...this.queryString };
        if (queryObj.primaryCategory)
            queryObj.primaryCategory = queryObj.primaryCategory.split(",");

        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1B) ADVANCED FILTERING WITH SUPPORT OF lt,gt,gte etc in query url
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lt|lte)\b/g,
            (match) => `$${match}`
        );
        return this.query.count(JSON.parse(queryStr));
    }
    paginate() {
        // 4) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}
module.exports = APIFeatures;
