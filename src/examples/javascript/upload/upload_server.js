/*
 * Copyright 2011-2012 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

load('vertx.js')

vertx.createHttpServer().requestHandler(function(req) {
  req.pause()
  var filename = vertx.generateUUID() + ".uploaded"
  vertx.FileSystem.open(filename, function(err, file) {
    var pump = new vertx.Pump(req, file.getWriteStream())
    req.endHandler(function() {
      file.close(function() {
        stdout.println("Uploaded " + pump.bytesPumped + " bytes to " + filename);
        req.response.end();
      });
    });
    pump.start()
    req.resume()
  });
}).listen(8080)