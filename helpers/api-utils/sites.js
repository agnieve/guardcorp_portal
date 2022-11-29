export async function fetchGeneratedLatLng(placeId) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.GOOGLE_MAP_KEY}`);

    const result = await response.json();
    return result?.results[0]?.geometry?.location;
}

export async function fetchSearchPlaces(search) {

    const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&types=geocode&key=AIzaSyCgi4N0oldgAPrkEBsm9BET-NB_vnzzA6s`);

    const result = await response.json();
    return result;
}


export async function updateSite(id, client, token) {
    try {

        const response = await fetch(`${process.env.base_url}/api/sites/update?id=${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(client)
        })

        return await response.json();

    } catch (e) {
        return e
    }
}

export async function createSite(client, token) {

    const response = await fetch(`${process.env.base_url}/api/sites/add`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(client)
    })

    return await response.json();


}

export async function getAllSites(token) {

    const response = await fetch(`${process.env.base_url}/api/sites`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.json();

}

export async function deleteSite(token, siteId) {
    const response = await fetch(`${process.env.base_url}/api/sites/delete?id=${siteId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return await response.json();
}
