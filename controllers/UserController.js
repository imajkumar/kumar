const db = require( "../models" );
const auth = require( "../middlewares/jwt" );
const apiResponse = require( "../helpers/apiResponse" );
const bcrypt = require( "bcrypt" );
const cloudinary = require( '../cloudinary' );
const mailer = require( "../helpers/mailer" );
const { body, validationResult } = require( 'express-validator' );
const SendOtp = require( "sendotp" );
const jwt = require("jsonwebtoken");
// const sendOtp = new SendOtp( "332533AhDBihu7o608ce1a0P1" );
const sendOtp = new SendOtp("332216AFvgqqc248D163b933dfP1", '{{otp}} is OTP for kumardhubi');

var generateRandomNDigits = ( n ) =>
{
    return Math.floor( Math.random() * ( 9 * Math.pow( 10, n ) ) ) + Math.pow( 10, n );
};

//updateProfile
exports.updateProfile=[
    async function(req,res){
        try
        {
            var gender = req.body.gender;
            var user_id = req.body.user_id;
            const resultData = await db.Users.findOne( { _id: user_id } ).exec();

            if ( resultData )
            {
                const filter = { user_id: user_id };
                const update = { gender: gender};

                let doc = await db.Users.findOneAndUpdate( filter, update, {
                    new: true
                } );
                // 59           
                return apiResponse.successResponseWithData( res, "Updated OTO with data", doc );



               

            }else{
                return apiResponse.ErrorResponse( res, 'err' );
            }

           

        } catch ( err )
        {
            return apiResponse.ErrorResponse( res, err );
        }
    }
]
//updateProfile

exports.checkMobileRegistered = [
    async function ( req, res )
    {

        try
        {
            var phone = req.body.phone;
            const OTP = generateRandomNDigits( 3 );
            // db.Users.findOne({phone: phone}, function(err,obj) { console.log(obj); });
            const resultData = await db.Users.findOne( { phone: phone } ).exec();

            if ( resultData )
            {

                if ( resultData.verify_phone )
                {  //if true
                    return apiResponse.successResponseWithData( res, "Phone verify Already", resultData );

                } else
                { //if false
                    sendOtp.send( phone, "KUMARD", OTP, function ( error, data )
                    {
                        console.log( data );
                    } );
                    const otpTriesCount = resultData.otpTries + 1;

                    const filter = { phone: phone };
                    const update = { OTP: OTP, otpTries: otpTriesCount };

                    let doc = await db.Users.findOneAndUpdate( filter, update, {
                        new: true
                    } );
                    // 59           
                    return apiResponse.successResponseWithData( res, "Updated OTO with data", doc );


                }


            } else
            {
                sendOtp.send( phone, "PRIIND", OTP, function ( error, data )
                {
                    console.log( data );
                } );
                //create new user 
                const usersObj = new db.Users( {
                    phone: phone,
                    OTP: OTP
                } );
                usersObj
                    .save( usersObj )
                    .then( data =>
                    {
                        return apiResponse.successResponseWithData( res, "New User Created.", data );

                    } )
                    .catch( err =>
                    {
                        return apiResponse.ErrorResponse( res, err );
                    } );

                //create new user 
            }




        } catch ( err )
        {
            return apiResponse.ErrorResponse( res, err );
        }
    }
]
exports.userRegister = [
    // auth, // this used for admin access
    function ( req, res )
    {
        try
        {
            var user_id = req.body.user_id;
            var name = req.body.name;
            var email = req.body.email;
            var password = req.body.password;
            //update register by user_id data
            bcrypt.hash( password, 10, async function ( err, hash )
            {
                const filter = { _id: user_id };
                const update = { name: name, email: email, password: hash, verify_phone: true };

                let doc = await db.Users.findOneAndUpdate( filter, update, {
                    new: true
                } );

                return apiResponse.successResponseWithData( res, "User Registed with user_id", doc );

            } );

            // 59           


            //update register by user_id data

        } catch ( err )
        {
            return apiResponse.ErrorResponse( res, err );
        }
    }
];

//userLogin
exports.userLogin=[
    async function(req,res){
        try{
            const errors = validationResult( req );

            if ( !errors.isEmpty() )
            {
                return apiResponse.ErrorResponse( res, errors );


            }
            const resultData = await db.Users.findOne({phone : req.body.phone}).then(user => {
                console.log('user')
                if (user) {
                    bcrypt.compare(req.body.password,user.password,function (err,same) {
                        if(same){
                           
                                let userData = {
                                    _id: user._id,
                                    firstname: user.name,
                                    phone: user.phone,
                                };
                                //Prepare JWT token for authentication
                                const jwtPayload = userData;
                                const jwtData = {
                                    expiresIn: process.env.JWT_TIMEOUT_DURATION,
                                };
                                const secret = process.env.JWT_SECRET;
                                //Generated JWT token with Payload and secret.
                                //userData.access_token = jwt.sign(jwtPayload, secret, jwtData);
                                const access_token = jwt.sign(jwtPayload, secret, jwtData);
                                const data={
                                    access_token:access_token,
                                    users:user
                                }
                                return apiResponse.successResponseWithData(res,"Login Success.", data);
                                
                        }else{
                            return apiResponse.unauthorizedResponse(res, "1Invalid Login Crredentials");
                        }
                    });

                }else{
                    return apiResponse.unauthorizedResponse( res, "2Invalid Login Credentials", user );

                }
            });

        }catch(err){
            return apiResponse.ErrorResponse( res, err );
        }
    }
]
//--userLogin
//userUpload
exports.userUpload = async ( req, res ) =>
{
    const uploader = async ( path ) => await cloudinary.uploads( path, 'Images' );
    if ( req.method === 'POST' )
    {
        const urls = []
        const files = req.files;
        for ( const file of files )
        {
            const { path } = file;
            const newPath = await uploader( path )
            urls.push( newPath )


        }
    }

    return apiResponse.successResponseWithData( res, "Registration Success.", [] );


}
//-userUpload
//userAvatar

exports.userAvatar = async ( req, res ) =>
{
    const uploader = async ( path ) => await cloudinary.uploads( path, 'avatar' );

    if ( req.method === 'POST' )
    {

        const files = req.file;
        const { path } = files;
        const newPath = await uploader( path )
        //   console.log(newPath.url);
        //   console.log(newPath.id);
        //   console.log(newPath);
        const imgUrl = 'https://res.cloudinary.com/imajkumar/image/upload/q_90,w_200,h_150/v1635336061/' + newPath.id + '.png';


        const user = new UserModel(
            {
                firstName: 'Ajay',
                lastName: 'Kumar',
                email: 'ajayit2020@gmail.com',
                password: 'kumar',
                confirmOTP: 4544,
                avatar: imgUrl
            }
        );

        user.save( function ( err )
        {
            if ( err ) { return apiResponse.ErrorResponse( res, err ); }
            let userData = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar
            };
            //send email
            let html = "<p>Please Confirm your Account.</p><p>OTP:565</p>";
            mailer.send(
                'ajayit2020@gmail.com',
                'ajayit2020@gmail.com',
                "Confirm Account",
                html
            ).then( function ()
            {
                console.log( 'sent mail' );
            } );

            //send email 
            return apiResponse.successResponseWithData( res, "Registration Success.", userData );
        } );


        //https://res.cloudinary.com/imajkumar/image/upload/q_90,w_200,h_150/v1635336061/avatar/tmtjehrjns7iylfof073.png


    }




}
//userAvatar
