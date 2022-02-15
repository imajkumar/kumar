var mongoose = require("mongoose");
var Schema = mongoose.Schema;
module.exports = mongoose =>
{
    var schema = mongoose.Schema(
        {
           
            gender: { type: Boolean, required: true, default: 0 },
            user: { type: Schema.ObjectId, ref: "users", required: true },
           
        },
        { timestamps: true }
    );

    schema.method( "toJSON", function ()
    {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    } );

    const TblProfiles = mongoose.model( "profiles", schema );
    return TblProfiles;
};