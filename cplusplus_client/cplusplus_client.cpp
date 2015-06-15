//
//  sio_test_sample.cpp
//
//  Created by Melo Yao on 3/24/15.
//

#include "include/sio_client.h"

#include <functional>
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <string>
#include <stdio.h>
#include <fstream>

using namespace sio;
using namespace std;

int main(int argc ,const char* args[]){

    sio::client h;
    h.connect("http://localhost:8080");

    // Open file
    std::ifstream ifs;
    ifs.open("elarchivo.jpg", std::ifstream::in);
    ifs.seekg(0, ifs.end);
    int length = ifs.tellg();
    char* buf = new char[length];
    ifs.seekg(0,ifs.beg);
    ifs.read(buf,length);
    ifs.close();

    h.socket()->emit("connection");
    h.socket()->emit("file_upload", std::make_shared<std::string>(buf,length));
  
    h.sync_close();
    h.clear_con_listeners();
	return 0;
}

