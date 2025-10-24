package http

type DeleteSuccess struct {
	Message string
}

type ErrResponse struct {
	Error string `json:"error"`
}

type SuccessMessage struct {
	Message string
}
