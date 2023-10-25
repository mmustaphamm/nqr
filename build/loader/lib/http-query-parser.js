"use strict";
/**
 * @description parses the params that are part of the search query
 * @param {Object} obj query params
 * @return {Object}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const HTTPQueryParser = function (obj) {
    const { pageNumber, filter, pageSize } = obj;
    const page = Math.abs(parseInt(pageNumber)) || 1;
    const docLimit = parseInt(pageSize) || 10;
    const skip = docLimit * (page - 1);
    const options = {};
    if (filter) {
        const filters = filter.replace(" ", "").split(",");
        filters.map((e) => (options[e.trim()] = 1));
    }
    return {
        skip: skip,
        size: docLimit,
        filters: options
    };
};
exports.default = HTTPQueryParser;
