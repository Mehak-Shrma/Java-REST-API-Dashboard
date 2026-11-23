

package org.glassfish.jersey.archetypes;

import java.util.List;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;

@Path("DATAs")
@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
@Produces(MediaType.APPLICATION_JSON)
public class DATAresourse {

    DATArepo repo = new DATArepo();

    // READ ALL
    @GET
    @Path("DATA")
    public List<DATA> getDATAs() {
        return repo.getDATAs();
    }

    // CREATE
    @POST
    @Consumes({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
    @Path("DATA")
    public DATA createDATA(DATA d1) {
        repo.create(d1);
        return d1;
    }

    // UPDATE
    @PUT
    @Consumes({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
    @Path("DATA")
    public DATA updateDATA(DATA d1) {
        repo.update(d1);
        return d1;
    }

    // DELETE
    @DELETE
    @Path("DATA/{id}")
    public String deleteDATA(@PathParam("id") int id) {
        repo.delete(id);
        return "DATA deleted successfully";
    }
}
