
export async function updateClient(id, client, token){
    try{

        const response = await fetch(`${process.env.base_url}/api/clients/update?id=${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(client)
        })

        if(response.ok){
            const resp = await response.json();
            console.log(resp);
            return resp;
        }
    }catch(e){
        return e
    }
}

export async function createClient(client, token){

    try{

        const response = await fetch(`${process.env.base_url}/api/clients/add`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(client)
        })

        if(response.ok){
            const resp = await response.json();
            console.log(resp);
            return resp.acknowledged;
        }
    }catch(e){
        return e
    }
}

export async function getAllClients(token){
    try{

        const response = await fetch(`${process.env.base_url}/api/clients`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if(response.ok){
            return response.json();
        }

    }catch (error){
        return error
    }
}