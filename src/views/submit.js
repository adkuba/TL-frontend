import axios from 'axios'

var sendMessage = 'sending'

export async function submitTimeline(baseApi, editTimeline, timeline, token, eventsParsed, events, subEventsParsed, deletedPictures){
    var timelinesApi = baseApi + 'timelines'
    var myParams = {
        findUser: true,
        withDelete: true,
        add: true
    }
    if (editTimeline){
        myParams.add = false
    }

    var timelineCopy = JSON.parse(JSON.stringify(timeline))
    delete timelineCopy["pictures"]
    delete timelineCopy["picturesRaw"]
    delete timelineCopy["user"]

    //main timeline
    await axios.post(timelinesApi, timelineCopy, {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        params: myParams
    }).catch(error => {
        sendMessage = "error"
        console.log(error)
        if (error.toString().includes("409")){
            sendMessage = "taken"
        }
    })
    if (sendMessage == "error" || sendMessage == "taken"){
        return sendMessage
    }

    //main timeline images
    await sendPictures(timelinesApi + "/" + timeline.id, timeline.pictures, timeline.picturesRaw, token)
    if (sendMessage == "error"){
        return sendMessage
    }

    //events
    var eventsApi = baseApi + 'events/multiple'
    var eventsParsedSubmitTemp = JSON.parse(JSON.stringify(eventsParsed))
    var eventsParsedSubmit = null
    for (var i=0, len=eventsParsedSubmitTemp.length; i<len; i++){
        eventsParsedSubmitTemp[i].timelineId = timeline.id
        delete eventsParsedSubmitTemp[i]['type']
        delete eventsParsedSubmitTemp[i]['id']
        delete eventsParsedSubmitTemp[i]['pictures']
        delete eventsParsedSubmitTemp[i]['picturesRaw']
    }
    await axios.post(eventsApi, eventsParsedSubmitTemp, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(async (response) => {
        for (i=0, len=events.length; i<len; i++){
            await sendPictures(baseApi + 'events/' + response.data[i].id, events[i].pictures, events[i].picturesRaw, token)
            if (sendMessage == "error"){
                return
            }
        }
        eventsParsedSubmit = response.data
    })
    .catch(error => {
        sendMessage = "error"
        console.log(error)
    })
    if (sendMessage == "error"){
        return sendMessage
    }

    //subTimelines
    var timelinesApi = baseApi + 'timelines/multiple'
    var subTimelines = []
    var subTimelinesSubmitted = null
    for (var i=0, len=eventsParsed.length; i<len; i++){
        var subEvtsTemp = JSON.parse(JSON.stringify(subEventsParsed.find(x => x.id === eventsParsed[i].id).subEvents))
        if (subEvtsTemp.length > 0){
            //found subTimeline
            var subTimeline = {
                id: timeline.id + '-sub' + i,
                eventId: eventsParsedSubmit[i].id
            }
            subTimelines.push(subTimeline)
        }
    }
    if (subTimelines.length == 0){
        sendMessage = 'ok'
        return sendMessage
        
    } else {
        await axios.post(timelinesApi, subTimelines, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
        .then(response => {
            subTimelinesSubmitted = response.data
        })
        .catch(error => {
            sendMessage = "error"
            console.log(error)
        })
        if (sendMessage == "error"){
            return sendMessage
        }
    }

    //subEvents
    var eventsApi = baseApi + 'events/multiple'
    var counter = 0
    for (var i=0, len=eventsParsed.length; i<len; i++){
        var subEvtsTemp = JSON.parse(JSON.stringify(subEventsParsed.find(x => x.id === eventsParsed[i].id).subEvents))
        if (subEvtsTemp.length > 0){
            for (var j=0, len2=subEvtsTemp.length; j<len2; j++){
                delete subEvtsTemp[j]['type']
                delete subEvtsTemp[j]['id']
                delete subEvtsTemp[j]['pictures']
                delete subEvtsTemp[j]['picturesRaw']
                subEvtsTemp[j].timelineId = subTimelinesSubmitted[counter].id
            }
            counter += 1
            await axios.post(eventsApi, subEvtsTemp, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(async (response) => {
                    //"i" sie nie zmienia bo jest await
                    var subEvtsTemp = subEventsParsed.find(x => x.id === eventsParsed[i].id).subEvents.slice()
                    for (var k=0, len3=subEvtsTemp.length; k<len3; k++){
                        await sendPictures(baseApi + 'events/' + response.data[k].id, subEvtsTemp[k].pictures, subEvtsTemp[k].picturesRaw, token)
                        if (sendMessage == "error"){
                            return
                        }
                    }
                })
                .catch(error =>{
                    sendMessage = "error"
                    console.log(error)
                })
        }
    }
    if (sendMessage == "error"){
        return sendMessage
    }

    //deletedPictures
    if (deletedPictures.length > 0){
        var formData = new FormData()
        for (var i=0, len=deletedPictures.length; i<len; i++){
            formData.append("urls", deletedPictures[i])
        }
        await axios.post(baseApi + 'files', formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        }).catch(error => {
            sendMessage = "error"
            console.log(error)
        })
    }
    if (sendMessage == "error"){
        return sendMessage
    }

    sendMessage = "ok"
    return sendMessage
}

async function sendPictures(url, array, arrayRaw, token){
    //pictures
    var formData = new FormData()
    for (var i=0, len=arrayRaw.length; i<len; i++){
        formData.append("pictures", arrayRaw[i])
    }
    var urlList = new FormData()
    for (i=0, len=array.length; i<len; i++){
        if (array[i].substring(0,4) != 'data'){
            urlList.append("picturesURL", array[i])
        }
    }
    if (!urlList.has("picturesURL")){
        urlList.append("picturesURL", "")
    }
    
    //new images
    await axios.post(url + "/pictures", formData, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data'
        }
    }).catch(error => {
        sendMessage = "error"
        console.log(error)
    })
    if (sendMessage == "error"){
        return
    }

    //old pictures
    await axios.post(url + "/picturesURL", urlList, {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
    .catch(error => {
        sendMessage == "error"
        console.log(error)
    })
    if (sendMessage == "error"){
        return
    }
}