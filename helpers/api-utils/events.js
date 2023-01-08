
export async function getAllEvents(args){

    console.log(`${process.env.base_url}/api/events?eventId=${args[0]}`);

    try{

        const response = await fetch(`${process.env.base_url}/api/events?eventId=${args[0]}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${args[1]}`,
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
