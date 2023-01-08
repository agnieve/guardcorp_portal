export async function updateUser(id, user, token) {

    const response = await fetch(`${process.env.base_url}/api/users/update?id=${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(user)
    });

    return await response.json();

}

export async function createUser(user, token) {

    const response = await fetch(`${process.env.base_url}/api/users/add`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(user)
    });

    const resp = await response.json();
    return resp;
}

export async function getAllUsers(token) {
    const response = await fetch(`${process.env.base_url}/api/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return await response.json();
}

export async function getActiveUsers(token) {
    const response = await fetch(`${process.env.base_url}/api/users/active`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return await response.json();
}

export async function getAllGuards(token) {
    const response = await fetch(`${process.env.base_url}/api/users/guards`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return await response.json();
}

export async function deleteUser(token, userId) {
    const response = await fetch(`${process.env.base_url}/api/users/delete?id=${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return await response.json();
}

export async function uploadUserPicture(picture){

    try{

        let body = new FormData();
        body.append('key', 'ef61c51b56ca06b371fcc99b80b3873c');
        body.append('image', picture);

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method:'POST',
            body:body
        });

        if(response.ok){
            return await response.json();
        }

        return false;

    }catch(error){
        console.log(error.message)
    }

}