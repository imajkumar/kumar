module.exports = mongoose =>
{
    var schema = mongoose.Schema(
        {
            name: { type: String, required: false },
            phone: { type: Number, required: true },
            OTP: { type: Number, required: true },
            email: { type: String, required: false },
            password: { type: String, required: false },
            avatar: { type: String, required: false },
            verify_phone: { type: Boolean, required: true, default: 0 },
            verify_email: { type: Boolean, required: true, default: 0 },                       
            account_status: { type: Boolean, required: true, default: 1 },
            otpTries: { type: Number, required: false, default: 0 }
        },
        { timestamps: true }
    );

    schema.method( "toJSON", function ()
    {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    } );

    const TblUsers = mongoose.model( "users", schema );
    return TblUsers;
};