import { expect, should } from "chai"; 
import mongoose from "mongoose";
import { it, describe,after, before, afterEach,beforeEach } from "mocha";
import supertest  from "supertest";
import petModel from "../src/dao/models/Pet.js";
import userModel from "../src/dao/models/User.js";
import adoptionModel from "../src/dao/models/Adoption.js";

should();
const requester=supertest("http://localhost:8080");

describe("Adoption Routes", () => {
    
    const userId = "67f48fe2190730167ad3efb1";
    const petId = "67f49243d31615ab4977529b";


    before(async function () { // Cambia a una función normal
        this.timeout(8000); // Aumenta el tiempo de espera
        mongoose.set("strictQuery", false);
        try {
            await mongoose.connect("mongodb+srv://nachomezalk24:8e9HbOWQ22Zgu0yh@dbpets.xao1tgo.mongodb.net/?retryWrites=true&w=majority&appName=dbpets", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Conexión exitosa a la base de datos");
        } catch (error) {
            console.error("Error al conectar con la base de datos:", error);
        }
    });

    after(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        // Revertir el estado de la mascota a "adopted: false"
        await petModel.findByIdAndUpdate(petId, { adopted: false });

        // Eliminar la mascota del arreglo "pets" del usuario
        await userModel.findByIdAndUpdate(userId, { $pull: { pets: { _id: petId } } });

        // Eliminar la adopción de la base de datos (si existe)
        await adoptionModel.deleteMany({ owner: userId, pet: petId });
    });

    describe("Prueba del metodo GET a la ruta /adoptions", () => {
        it("Exitosa: Debe retornar todas las adopciones ", async () => {
            const { body } = await requester.get("/api/adoptions").expect(200);

            // Validaciones del body
            body.should.have.property("status", "success");
            body.should.have.property("payload").that.is.an("array");
            body.payload.length.should.be.greaterThan(0); 

            // Validaciones dentro del payload
            const adoption = body.payload[0];
            adoption.should.have.property("_id").that.is.a("string");
            adoption.should.have.property("owner").that.is.a("string");
            adoption.should.have.property("pet").that.is.a("string");
        });
    });

    describe("Prueba del metodo GET a la ruta /adoptions/:aid", () => {
        
        it("Exitosa: Debe retornar una adopcion por ID", async () => {
            const adoptionId= "67f848bdb97b51c77c90d2b3"; // Esto tiene que ser un ID de adopción válido
            const { body } = await requester.get(`/api/adoptions/${adoptionId}`).expect(200);

            // Validaciones del body
            body.should.have.property("status", "success");
            body.should.have.property("payload").that.is.an("object");

            // Validaciones del objeto payload
            const adoption = body.payload;
            adoption.should.have.property("_id").that.is.a("string");
            adoption.should.have.property("owner").that.is.a("string");
            adoption.should.have.property("pet").that.is.a("string");
        });

        it("Prueba de error: Debe retornar un error por intentar llamar a un ID inexistente", async () => {
            const { body } = await requester.get("/api/adoptions/67f7348f651c507227d5f5d2").expect(404);
            // Validaciones del body
            body.should.have.property("status", "error");
            body.should.have.property("error","Adoption not found");

        });
    });

    
    describe("Prueba del metodo POST a la ruta /adoptions/:uid/:pid", () => {
        
        it("Exitosa: Debe crear una adopcion, agregnado una mascota al arreglo pet del user, y poniendo en true la propiedad adopted de la mascota", async () => {
            const { body } = await requester.post(`/api/adoptions/${userId}/${petId}`).expect(201);

            // Validaciones del body
            body.should.have.property("status", "success");
            body.should.have.property("message","Pet adopted");

        });

        it("Prueba de error: Debe retornar un error al intentar enviar un id de mascora o usuario invalido", async () => {
            const { body } = await requester.post(`/api/adoptions/23fg23/67f4`).expect(400);

            // Validaciones del body
            body.should.have.property("status", "error");
            body.should.have.property("error","Invalid id");

        });

        it("Prueba de error: Debe retornar un error al intentar adoptar una mascota que no existe", async () => {
            const { body } = await requester.post(`/api/adoptions/${userId}/67f49243d01615ab4923529b`).expect(404);

            // Validaciones del body
            body.should.have.property("status", "error");
            body.should.have.property("error","Pet not found");

        });

        it("Prueba de error: Debe retornar un error al intentar adoptar con un usuario que no existe", async () => {
            const { body } = await requester.post(`/api/adoptions/62f48fe2180730167ad3efb1/${petId}`).expect(404);

            // Validaciones del body
            body.should.have.property("status", "error");
            body.should.have.property("error","user Not found");

        });

        it("Prueba de error: Debe retornar un error al intentar adoptar una mascota que ya fue adoptada", async () => {
            // Primero, adopta la mascota
            await requester.post(`/api/adoptions/${userId}/${petId}`);

            // Luego intenta adoptar la misma mascota nuevamente
            const { body } = await requester.post(`/api/adoptions/${userId}/${petId}`).expect(400);

            // Validaciones del body
            body.should.have.property("status", "error");
            body.should.have.property("error","Pet is already adopted");

        });
    });

});
