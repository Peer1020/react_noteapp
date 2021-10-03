import {render, screen} from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import React from 'react'
import {NotesEndpoint} from "./api";

/*** Setup ***/

const handlers = [
  rest.get(NotesEndpoint, (req, res, ctx) => {
    return res(
        ctx.json([{
          "_id": "614c9842f5d0b002935bf82f",
          "title": "Clean rooms",
          "content": "Clean kitchen and living room.",
          "importance": 3,
          "due": "2021-10-01T23:59:99.999Z",
          "finished": true,
          "createdAt": "2021-09-23T15:07:46.161Z",
          "updatedAt": "2021-09-30T08:13:36.341Z",
          "__v": 0
        }, {
          "_id": "614c9843f5d0b002935bf831",
          "title": "Bring out garbage",
          "content": "Dispose of plastic and residual waste.",
          "importance": 5,
          "due": "2021-10-02T15:00:00.000Z",
          "finished": true,
          "createdAt": "2021-09-23T15:07:47.923Z",
          "updatedAt": "2021-09-30T08:13:49.726Z",
          "__v": 0
        }])
    )
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

/*** Tests ***/

test('renders title', async () => {
  render(<App/>)

  const heading = await screen.findByRole('heading')

  expect(heading).toHaveTextContent('Notes')
})

test('fetches and renders todos', async () => {
  render(<App/>)

  const cleaning = await screen.findByText(/Clean rooms/);
  const garbage = await screen.findByText(/Bring out garbage/);

  expect(cleaning).toBeTruthy()
  expect(garbage).toBeTruthy()
})

test('displays api errors', async () => {
  server.use(rest.get(NotesEndpoint, (req, res, ctx) => res(ctx.status(500))))

  render(<App />)
  const alertElement = await screen.findByRole("alert")

  expect(alertElement).toHaveTextContent(/Error/)
})