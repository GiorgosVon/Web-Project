const moment = require("moment");
const format = "MMMM Do YYYY, h:mm:ss a"

const ejsHelper = {
    checkDate: function (date) {
        if (date != "") {
            return moment(date.slice(-1)[0].uploadedAt).format(format);
        } else if (date == "")
            return "You have not uploaded a file yet"
    }
}

module.exports = ejsHelper;