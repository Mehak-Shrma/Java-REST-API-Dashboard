package com.restapi;

import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;


//JAX-RS / Jersey application configuration.
// Exposes all REST resources under the "/webapi" base path.

@ApplicationPath("webapi")
public class RestApplication extends ResourceConfig {

    public RestApplication() {
        packages("com.restapi");
        register(CorsFilter.class);
    }
}
