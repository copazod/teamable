
const { app, server } = require('./server')
const request = require('supertest')

test("test request with valid payload", async function(){
    const testPayload = {
        name: "test name",
        email: "test.email@example.com",
        interest: "testing"
    }
    const response = await request(app)
        .post('/update-profile')
        .send(testPayload)

    console.log(response.body)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("info")
    expect(response.body.info).toBe("User data profile updated successfull")

    server.close()
})

test("test request with invalid payload", async function(){
    const testPayload = {}
    const response = await request(app)
        .post('/update-profile')
        .send(testPayload)

    console.log(response.body)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("error")
    expect(response.body.error).toBe("empty payload. Couldnt update data")
    
    server.close()
})