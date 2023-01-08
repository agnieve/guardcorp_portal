
export async function updateShift(id, client, token) {
    try {

        const response = await fetch(`${process.env.base_url}/api/shifts/update?id=${id}`, {
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

export async function createShift(client, token) {

    const response = await fetch(`${process.env.base_url}/api/shifts/add`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(client)
    })

    return await response.json();

}

export async function addMemberShift(member, token) {

    const response = await fetch(`${process.env.base_url}/api/shifts/member/add`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(member)
    })

    return await response.json();

}

export async function getShiftMembers(token, shiftId) {

    const response = await fetch(`${process.env.base_url}/api/shifts/member?shiftId=${shiftId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    const res = await response.json();
    console.log('from getShiftMembers api',res);
    return res;

}

export async function getAllShifts(token) {

    const response = await fetch(`${process.env.base_url}/api/shifts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.json();

}

export async function deleteShift(token, shiftMemberId) {
    const response = await fetch(`${process.env.base_url}/api/shifts/member/delete?id=${shiftMemberId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return await response.json();
}
