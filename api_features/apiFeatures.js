class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    console.log(this.queryString);
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|ge|lte|lt|eq)\b/g,
      (match) => `$${match}`,
    );
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createAt');
    }
    return this;
  }

  limitField() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paging() {
    console.log('hi');
    const page = parseInt(this.queryString.page) || 1; // Default is page 1

    const limit = parseInt(this.queryString.limit) || 10; // Default is 10 results per page
    console.log(limit);
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);

    return this;
  }

  // add new collection
}

module.exports = APIFeatures;
