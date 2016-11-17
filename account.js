jQuery(document).ready(function(){
    if (getLoggedInUser()['id'] != undefined) {
        var user = getLoggedInUser();
        jQuery("#email_update").val(user['user']['email']);
        jQuery("#account_info_div").show();
    } else {
        jQuery("#sign_in_or_up_div").show();
    }
});

jQuery(document).on("click", "#sign_in_button", function(){
    attemptToLogIn();
});

jQuery(document).on("click", "#update_button", function(){
    var user = getLoggedInUser();
    var old_password = jQuery("#old_password").val();
    var new_password = jQuery("#new_password").val();
    if (validatePasswordFormat(new_password) && verifyPassword(old_password, user['user']['password'])) {
        user['user']['password'] = makeHash(new_password);
        updateUser(user, function(){
            window.sessionStorage.setItem("user", JSON.stringify(user));
            jQuery.notify("Successfully updated!");
            jQuery("#old_password").val("");
            jQuery("#new_password").val("");
        });
    } else {
        jQuery.notify("Invalid old password!");
    }
});

jQuery(document).on("click", "#sign_up_button", function(){
    var email = jQuery("#email").val();
    var password = jQuery("#password").val();
    if (validatePasswordFormat(password)) {
        password = makeHash(password);
        getUserByEmail(email, function (user) {
            if (user['id'] != undefined) {
                jQuery.notify("Account already exists!");
            } else {
                addUser(email, password, function (user) {
                    window.sessionStorage.setItem("user", JSON.stringify(user));
                    window.location.href = "recipes_list.html";
                })
            }
        });
    }
});

jQuery(document).on("click", "#sign_out_button", function(){
    window.sessionStorage.removeItem("user");
    window.location.href = "index.html";
});

jQuery(document).on("keydown", "#password", function(e){
    if (e.keyCode == 13) {
        attemptToLogIn();
    }
});

function attemptToLogIn()
{
    var email = jQuery("#email").val();
    if (validateEmailFormat(email)) {
        getUserByEmail(email, function (user) {
            if (user['id'] == undefined) {
                jQuery.notify("Account not found. Perhaps you meant to sign up?");
            } else {
                if (verifyPassword(jQuery("#password").val(), user['user']['password'])) {
                    window.sessionStorage.setItem("user", JSON.stringify(user));
                    window.location.href = "recipes_list.html";
                } else {
                    jQuery.notify("Invalid email/password!");
                }
            }
        });
    }
}

function validateEmailFormat(email)
{
    if (email.indexOf("@") == -1 || email.length < 4 || email.indexOf(".") == -1) {
        jQuery.notify("Invalid email address");
        return false;
    }
    return true;
}

function validatePasswordFormat(password)
{
    if (new_password.length < 6) {
        jQuery.notify("Password is too sort");
        return false;
    }
    return true;
}

function addUser(email, password, callback)
{
    var temp = users_ref.orderByChild("email").equalTo(email).on("value", function(snapshot) {
        users_ref.off("value", temp);
        existing_users = snapshot.val();
        var user_key = false;
        for (var key in existing_users) {
            user_key = key;
            break;
        }
        if (user_key === false) {
            var user_obj = {email : email, password : password};
            return_value = users_ref.push(user_obj);
            user = {"id" : return_value.key, "user" : user_obj};
        } else {
            if (existing_users[user_key]['password'] == password) {
                user = {"id" : key, "user" : existing_users[user_key]};
            } else {
                user = {};
            }
        }
        if (callback == undefined) {
            callback = "addUserResult";
            window[callback](user);
        } else {
            callback(user);
        }
    })
}

function addUserResult(user)
{
    console.log(user);
}

function updateUser(user, callback)
{
    var updated_user = {};
    updated_user["/" + users_table_name + "/" + user['id']] = user['user'];
    result = firebase.database().ref().update(updated_user);
    if (callback == undefined) {
        callback = "updateUserResult";
        window[callback](user);
    } else {
        callback(user);
    }
}

function updateUserResult(user)
{
    console.log(user);
}

function getUserByEmailPassword(email, password, callback)
{
    var temp = users_ref.orderByChild("email").equalTo(email).on("value", function(snapshot) {
        users_ref.off("value", temp);
        existing_users = snapshot.val();
        var user_key = false;
        for (var key in existing_users) {
            var existing_user = existing_users[key];
            if (existing_user['password'] == password) {
                user_key = key;
                break;
            }
        }
        if (user_key === false) {
            user = {};
        } else {
            user = {"id" : key, "user" : existing_users[user_key]};
        }
        if (callback == undefined) {
            callback = "getUserByEmailPasswordResult";
            window[callback](user);
        } else {
            callback(user);
        }
    })
}

function getUserByEmailPasswordResult(user)
{
    console.log(user);
}

function getUserByEmail(email, callback)
{
    var temp = users_ref.orderByChild("email").equalTo(email).on("value", function(snapshot) {
        users_ref.off("value", temp);
        existing_users = snapshot.val();
        var user_key = false;
        for (var key in existing_users) {
            user_key = key;
            break;
        }
        if (user_key === false) {
            user = {};
        } else {
            user = {"id" : key, "user" : existing_users[user_key]};
        }
        if (callback == undefined) {
            callback = "getUserByEmailResult";
            window[callback](user);
        } else {
            callback(user);
        }
    })
}

function getUserByEmailResult(user)
{
    console.log(user);
}