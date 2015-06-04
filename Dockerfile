FROM golang:1.4

RUN go get github.com/codegangsta/gin
ADD . /go/src/github.com/larryprice/refermadness

WORKDIR /go/src/github.com/larryprice/refermadness
RUN go get
