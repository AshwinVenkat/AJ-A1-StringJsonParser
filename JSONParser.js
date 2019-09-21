//const inp_str = "status:all,applied_date:2019-04-15--to--2019-04-15,screen_status:SR|NS";
const inp_str = "interview_attendance:P,interview_date:2019-04-15--to--2019-04-15,status:CAP";
//const inp_str = "location:mumbai|delhi|pune,list_type:S,min_education:1";

parseStringIntoJSON(inp_str);

function parseStringIntoJSON(input) {

    function formatKey(key) {
        if (key.indexOf("_") === -1) {
            return key;
        }

        return key.split("_").join(".")
    }

    function parseDateRange(dateStr) {
        const parts = dateStr.split(":");
        const valParts = parts[1].split("--to--").map((part, index) => {
            var date = new Date(part);
            if (index == 1) {
                date.setUTCHours(23, 59, 59, 00);
            }
            return date;
        });
        return [formatKey(parts[0]), { "between": valParts }]
    }

    function parseArray(arrStr) {
        const parts = arrStr.split(":");
        const valParts = parts[1].split("|");
        return [formatKey(parts[0]), { "inq": valParts }];
    }

    function parseObj(objStr) {
        const parts = objStr.split(":");
        return [formatKey(parts[0]), { "eq": parts[1] }];
    }

    function parseHandler(inpStr) {
        if (inpStr.indexOf("_date") !== -1) {
            //handle date range
            [key, value] = parseDateRange(inpStr);
        } else if (inpStr.indexOf("|") !== -1) {
            //handle array
            [key, value] = parseArray(inpStr);
        } else {
            //handle key:value pairs
            [key, value] = parseObj(inpStr);
        }
        result.and[key] = value;

    }

    let result = {
        and: {

        }
    }

    const parts = input.split(",");

    parts.forEach((part, index) => {
        parseHandler(part);
    });

    console.log("[RESULT] = ", result);
}