import Cookies from 'js-cookie'

function getJWT () {
    return Cookies.get('jsonwebtoken')
}

async function loginAuto () {
    const response = await fetch(`https://backend-production-03d9.up.railway.app/auto-login`, {
        headers: {
            'Authorization': `Bearer ${getJWT()}`
        }
    })
    
    if (response.status !== 200) {
        return null
    }
    const responseJSON = await response.text()
    const responseFinal = await JSON.parse(responseJSON)
    return responseFinal
}

export { getJWT, loginAuto }