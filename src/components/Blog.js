import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
    const [view, setView] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const likeBlog = (event) => {
        event.preventDefault()

        updateBlog({ ...blog, likes: blog.likes +1, user: blog.user.id })
    }

    const handleDelete = (event) => {
        event.preventDefault()
        if(window.confirm(`Do you really want to delete ${blog.title} by ${blog.author}`)) {
            removeBlog(blog)
        }
    }
    const expanded = () => (
        <div>
            {blog.title} <button onClick={() => setView(false)}>hide</button> <br/>
            {blog.url} <br/>
            {blog.likes} <button onClick={likeBlog}> like</button> <br/>
            {blog.author} <br/>
            {(blog.user.username === user.username) || !(blog.user === null) ?
                <button onClick={handleDelete}>delete</button> :
                ''
            }

        </div>
    )

    const minimized = () => (
        <div>
            {blog.title} {blog.author} <button onClick={() => setView(true)}>view</button>
        </div>
    )
    return (
        <div style={blogStyle}>
            {view === true ?
                expanded() :
                minimized()
            }

        </div>
    )
}

export default Blog
