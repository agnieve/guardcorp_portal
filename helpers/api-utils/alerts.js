
export async function updateAlert(id, client, token){
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

export async function createAlert(client, token){

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

export async function getAllAlerts(token){
    try{

        const response = await fetch(`${process.env.base_url}/api/alert`, {
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


export async function deleteAlert(token, clientId) {
    const response = await fetch(`${process.env.base_url}/api/clients/delete?id=${clientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return await response.json();
}