import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('Blog', () => {

    const blog = {
        title: 'Component testing is done with react-testing-library',
        url: 'www.fullstackopen.com',
        likes: 400,
        author: 'FullStackOpen',
        user: {
            username: 'test'
        }
    }
    const user = {
        username: 'test'
    }

    let mockUpdateBlog = jest.fn(event => console.log(event))

    test('renders title and author, but nothing else', () => {

        const user = {
            username: 'test'
        }

        const component = render(
            <Blog blog={blog} user={user} />
        )
        expect(component.container).toHaveTextContent(
            'Component testing is done with react-testing-library'
        )

        const div = component.container.querySelector('.blog')
        expect(div).toHaveTextContent('FullStackOpen')

        expect(component.container).not.toContain('www.fullstackopen.com')

    })

    test('clicking the button shows likes and url', () => {

        const user = {
            username: 'test'
        }

        const component = render(
            <Blog blog={blog} user={user} />
        )
        const button = component.getByText('view')
        fireEvent.click(button)

        const div = component.container.querySelector('.expanded')

        expect(div).toHaveTextContent('www.fullstackopen.com')
    })

    test('liking twice calls event handler twice', () => {

        const component = render(
            <Blog blog={blog} user={user} updateBlog={mockUpdateBlog}/>
        )
        const button = component.getByText('view')
        fireEvent.click(button)

        const likeButton = component.container.querySelector('.likeButton')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        console.log(mockUpdateBlog.mock.calls)
        expect(mockUpdateBlog.mock.calls).toHaveLength(2)
    })
})

describe('BlogForm', () => {
    test('calls the handler with the right props', () => {
        const createMockPost = jest.fn()

        const component = render(
            <BlogForm createBlogPost={createMockPost} />
        )

        const title = component.container.querySelector('#title')
        const button = component.container.querySelector('#submit-button')

        fireEvent.change(title, { target: { value: 'Testing' } })
        fireEvent.click(button)

        const blogPost = createMockPost.mock.calls

        expect(blogPost[0][0].title).toBe('Testing')
    })
})