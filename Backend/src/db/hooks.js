exports.timestampHook = {
    beforeCreate: (record, options) => {
        record.dataValues.created_at = Date.now();
        record.dataValues.updated_at = Date.now();
    },
    beforeUpdate: (record, options) => {
        record.dataValues.updated_at = Date.now();
    },
    beforeBulkCreate: (records, options) => {
        const timestamp = Date.now();
        records.forEach((record) => {
        record.dataValues.created_at = timestamp;
        record.dataValues.updated_at = timestamp;
        });
        },
}
