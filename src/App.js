import React, {useState, useEffect} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from "./components/Notification";
import './App.css'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState(null)
    const [style, setStyle] = useState(null)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with ', username, password)

        try {
            const user = await loginService.login({username, password})

            window.localStorage.setItem(
                'loggedBlogListUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setStyle(false)
            setNotification('Wrong credentials')
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        }
    }

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                <h1>Login to application</h1>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({target}) => setPassword(target.value)}
                />

            </div>
            <button type="submit">login</button>
        </form>
    )

    const handleNewBlog = async event => {
        event.preventDefault()


        const newBlog = {
            title: title,
            author: author,
            url: url
        }

        const response = await blogService.create(newBlog)
        setBlogs(blogs.concat(response))
        setTitle('')
        setAuthor('')
        setUrl('')

        setStyle(true)
        setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }
    const blogView = () => (
        <div>
            <h2>blogs</h2>
            <p>{user.name} logged in <button onClick={() => setUser(null)}>logout</button></p>
            <h2>create new</h2>
            <form onSubmit={handleNewBlog}>
                <div>
                    title:
                    <input
                        type="text"
                        value={title}
                        name="title"
                        onChange={({target}) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author:
                    <input
                        type="text"
                        value={author}
                        name="author"
                        onChange={({target}) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    url:
                    <input
                        type="text"
                        value={url}
                        name="url"
                        onChange={({target}) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">create</button>
            </form>

            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog}/>
            )}
        </div>
    )
    return (
        <div>
            <Notification message={notification} style={style}/>
            {user === null ?
                loginForm()
                : blogView()

            }
        </div>
    )
}

export default App