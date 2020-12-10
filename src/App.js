import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './App.css'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState(null)
    const [style, setStyle] = useState(null)

    const blogFormRef = React.createRef()


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
            const user = await loginService.login({ username, password })

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

    const updateBlog = async (blog) => {
        await blogService.update(blog)
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs)

    }

    const removeBlog = async (blog) => {
        await blogService.remove(blog)
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs)
    }
    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                <h1>Login to application</h1>
                username
                <input
                    type="text"
                    value={username}
                    id='username'
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type='password'
                    value={password}
                    id='password'
                    onChange={({ target }) => setPassword(target.value)}
                />

            </div>
            <button id="loginButton" type="submit">login</button>
        </form>
    )

    const handleNewBlog = async (newBlog) => {
        blogFormRef.current.toggleVisibility()

        const response = await blogService.create(newBlog)
        setBlogs(blogs.concat(response))

        setStyle(true)
        setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }

    const logoutHandler = async (event) => {
        event.preventDefault()
        setUser(null)
        await window.localStorage.clear()
    }

    const blogView = () => (
        <div>
            <h2>blogs</h2>
            <p>{user.name} logged in <button onClick={logoutHandler}>logout</button></p>

            <Togglable buttonLabel='create' ref={blogFormRef}>
                <BlogForm
                    createBlogPost={handleNewBlog}
                />
            </Togglable>

            {blogs.sort((a, b) =>
                b.likes - a.likes)
                .map(blog =>
                    <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user}/>
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