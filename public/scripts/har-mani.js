document.getElementById('import').onclick = function () {
    var files = document.getElementById('selectFiles').files;
    console.log(files);
    if (files.length <= 0) {
        return false;
    }

    var fr = new FileReader();

    fr.onload = function (e) {
        function createHeaderObject(headers, valueName) {
            let found = 0;
            const content = []
            for (let i = 0; i < length; i++) {
                for (heads of headers[i]) {
                    //console.log(heads.name);
                    if (heads.name === valueName) {
                        //console.log("mpika")
                        content.push({
                            id: i,
                            [valueName]: heads.value
                        })
                        found = 1;
                    }
                }
                if (found !== 1) {
                    content.push({
                        id: i,
                        [valueName]: ""
                    })
                }
                found = 0;
            }
            return content;
        }

        function mergeArrayObjects(arr1, arr2) {
            return arr1.map((item, i) => {
                if (item.id === arr2[i].id) {
                    //merging two objects
                    return Object.assign({}, item, arr2[i])
                }
            })
        }

        console.log(e);
        var result = JSON.parse(e.target.result);
        //var formatted = JSON.stringify(result, null, 2);
        //document.getElementById('result').value = formatted;        


        //const jsonContents = JSON.parse(fileContents);
        const jsonContents = result;
        const dates = jsonContents.log.entries.map(entry => entry.startedDateTime);
        const ip = jsonContents.log.entries.map(entry => entry.serverIPAddress);
        const timing = jsonContents.log.entries.map(entry => entry.timings.wait);
        const urls = jsonContents.log.entries.map(entry => entry.request.url);

        // Get domain name
        const getHostname = (url) => {
            // use URL constructor and return hostname
            return new URL(url).hostname;
        }


        const methods = jsonContents.log.entries.map(entry => entry.request.method);
        const statuses = jsonContents.log.entries.map(entry => entry.response.status);
        const statusTexts = jsonContents.log.entries.map(entry => entry.response.statusText);
        const requestHeaders = jsonContents.log.entries.map(entry => entry.request.headers);
        const responseHeaders = jsonContents.log.entries.map(entry => entry.response.headers);
        var length = dates.length;

        const host = createHeaderObject(requestHeaders, "Host");
        const content = createHeaderObject(responseHeaders, "Content-Type");
        const cache = createHeaderObject(responseHeaders, "cache-control");
        const pragma = createHeaderObject(responseHeaders, "pragma");
        const age = createHeaderObject(responseHeaders, "age");
        const lastModified = createHeaderObject(responseHeaders, "Last-Modified");

        let finalHeader = mergeArrayObjects(host, pragma);
        finalHeader = mergeArrayObjects(finalHeader, content);
        finalHeader = mergeArrayObjects(finalHeader, cache);
        finalHeader = mergeArrayObjects(finalHeader, age);
        finalHeader = mergeArrayObjects(finalHeader, lastModified);


        let data = [];
        for (let i = 0; i < dates.length; i++) {
            data.push({
                id: i,
                ip: ip[i],
                url: getHostname(urls[i]), // Obtain domain names
                timing: timing[i],
                date: dates[i],
                method: methods[i],
                status: statuses[i],
                statusText: statusTexts[i]
            });
        }

        let finalData = mergeArrayObjects(finalHeader, data);
        console.log(finalData);

        var formatted = JSON.stringify(finalData, null, 2);
        document.getElementById('result').value = formatted;

    }
    fr.readAsText(files.item(0));
    console.log(fr);
};

$('#selectFiles').on('change', function () {
    //get the file name
    var fileName = $(this).val();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
})