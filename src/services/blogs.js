import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null


const setToken = newToken => {
    token = `bearer ${newToken}`
}
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const update = async (blog) => {
    const config = {
        headers: { Authorization: token }
    }

    const blogUrl = `${baseUrl}/${blog.id}`
    const response = await axios.put(blogUrl, blog, config)
    return response.data
}

const remove = async (blog) => {
    const config = {
        headers: { Authorization: token }
    }
    const blogUrl = `${baseUrl}/${blog.id}`
    const response = await axios.delete(blogUrl,config)
    return response.data
}
const create = async(newBlog) => {
    const config = {
        headers: { Authorization: token }
    }
    console.log(config)
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
}


export default { getAll, setToken, create, update, remove }