const path = require('path');
function shower(request, response) {
    // response.sendFile(path.join(__dirname ,"../views/index.html"));
    response.render("index",{user:request.flash('user')[0]});
}

module.exports = {
    shower,
};