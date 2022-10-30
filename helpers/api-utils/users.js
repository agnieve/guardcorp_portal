
export async function updateUser(id, user, token){
    try{

        const response = await fetch(`${process.env.base_url}/api/users/update?id=${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(user)
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

export async function createUser(user, token){

    try{

        const response = await fetch(`${process.env.base_url}/api/users/add`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(user)
        });

        if(response.ok){
            const resp = await response.json();
            console.log(resp);
            return resp.acknowledged;
        }
    }catch(e){
        return e
    }
}

export async function getAllUsers(token){
    try{

        const response = await fetch(`${process.env.base_url}/api/users`, {
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