module.exports.app = {
    errors : {
        'missing_parameter' : {
            status : 400,
            code : 1,
            message : "missing parameter.",
            description : "required parameters not provided. we deny the request in policy level."
        },
        'missing_parameter_api_key' : {
            status : 400,
            code : 2,
            message : "missing parameter api_key.",
            description : "api_key param is not set in header of request. we deny the request in policy level."
        },
       'page_not_found' : {
            status : 404,
            code : 1,
            message : "page not found.",
            description : "invalid URI. page not found.",
        },
        'invalid_error_object' : {
            status: 500,
            code: 1,
            message: "invalid error object",
            description: "an error generated in server side that is not in correct error object format"
        },
        'server_error' : {
            status: 500,
            code: 2,
            message: "an error occurred in server side.",
            description: "an error generated in server side."
        },
        'identifier_password_error' : {
            status: 400,
            code: 3,
            message: "identifier or password is wrong.",
            description: "identifier or password is wrong."
        },
        'password_error' : {
            status: 400,
            code: 3,
            message: "password is wrong.",
            description: "password is wrong."
        },
        'access_panel_error' : {
            status: 400,
            code: 3,
            message: "you do not have access.",
            description: "you do not have access."
        },
        'active_user_error' : {
            status: 400,
            code: 3,
            message: "you are inactive.",
            description: "you are inactive."
        },
        'banned_user_error' : {
            status: 400,
            code: 3,
            message: "you are banned.",
            description: "you are banned."
        }
    }
}