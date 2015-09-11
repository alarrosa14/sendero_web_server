# Sendero Web Server Prototype

This prototype shows how to connect NodeJS-Socket.IO with C++ using [Socket.IO C++](https://github.com/socketio/socket.io-client-cpp).

####**Dependencies:**
- [rapidjson](https://github.com/miloyip/rapidjson)
- [boost](http://www.boost.org/)
- [websocketpp++](https://github.com/zaphoyd/websocketpp)

####**Compilación:**
OS X:
`g++ -L./ -lsioclient -lboost_system-mt -lboost_random-mt -lboost_date_time-mt -o senderoTest cplusplus_client.cpp`

Linux:
`g++ -std=c++11 cplusplus_client.cpp -o test -Llib -lsioclient -lboost_system -lpthread`

Work in progress...
