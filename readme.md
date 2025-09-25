# Example request migration repository

Swapping from the request library to axios? Well this repository has some answers
in terms of incremental refactoring using tests. Specifically, it shows a method 
to wrap the request library itself then migrate to axios with promises in 2 steps.

CanRequest.forRequest()
CanRequest.forAxios()
new CanRequest(new RequestGateway())
new CanRequest(AxiosGateway())
const canRequest = canRequestFactory.connect(axiosGateway)


need to test (TODO):
* Custom Headers: Verify that custom headers (e.g., Authorization, Content-Type) are sent and received correctly.
* Query Parameters: Ensure query parameters are properly encoded and sent.
* Request Body: Test sending different types of bodies (JSON, form data, raw text).
* Cookies: Set and read cookies in requests and responses.
* Status Codes: Handle and assert different HTTP status codes (e.g., 404, 500, 201).
* Redirects: Test automatic and manual handling of HTTP redirects.
* Timeouts: Ensure requests fail or retry on timeout.
* Error Handling: Test network errors, invalid URLs, and server errors.
* Response Headers: Assert specific response headers are present.
* Streaming: Test handling of large or streaming responses.
* Authentication: Test basic, bearer, or custom authentication flows.
* HTTPS: Test requests to secure endpoints and certificate validation.
* Rate Limiting: Simulate and handle rate-limited responses (e.g., 429 Too Many Requests).
* Multipart/Form-Data: Test file uploads and multipart requests.
* Compression: Test gzip/deflate compressed responses.

