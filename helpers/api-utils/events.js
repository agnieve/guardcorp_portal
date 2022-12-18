
export async function getAllEvents(id, token){
    try{

        const response = await fetch(`${process.env.base_url}/api/events?eventId=${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const resp = await response.json();
        console.log(resp);
        return resp;
    }catch(e){
        return e
    }
}

export async function getEvent(eventId){
    try{

        console.log('Event ID');
        console.log(eventId);

        const response = await fetch(`${process.env.base_url}/api/events/find?eventId=${eventId}`, {
            method: "GET",
            // headers: {
            //     Authorization: `Bearer ${token}`,
            //     'Content-type': 'application/json; charset=UTF-8',
            // },
            // body: JSON.stringify(client)
        });

        const resp = await response.json();
        console.log(resp);
        return resp;
    }catch(e){
        return e
    }
}
