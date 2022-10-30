
export async function updateSite(id, client, token){
    try{

        const response = await fetch(`${process.env.base_url}/api/sites/update?id=${id}`, {
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

export async function createSite(client, token){

    try{

        const response = await fetch(`${process.env.base_url}/api/sites/add`, {
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

export async function getAllSites(token){
    try{

        const response = await fetch(`${process.env.base_url}/api/sites`, {
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

