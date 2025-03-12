import {fakerES_MX as faker}  from "@faker-js/faker";
import { createHash } from "../utils/index.js";
import {usersService,petsService} from "../services/index.js";

const createMockPet = async() => {
    try {
        const mock = {
            name: faker.animal.dog(),
            specie: faker.animal.type(),
            birthDate: faker.date.past(15, new Date()).toISOString().split('T')[0],
            adopted: faker.datatype.boolean(),
            owner: null,
            imageUrl: faker.image.urlLoremFlickr({ category: 'nature' })
        };
        return mock;
    } catch (err) {
        return err;
    }
}

const createMockUser = async()=>{
    const roles = ['user', 'admin'];
    try{
    const mock = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: await createHash('coder123'),
        role: roles[faker.number.int({ min: 0, max: 1 })],
        pets: []
    };
    return mock;
    }catch(err){
        return err;
    }
}

const getMocksUsers = async(req,res)=>{
    const mocksUser = [];
    try{
        for (let i = 0; i < 50; i++) {
            mocksUser.push(await createMockUser());
        }
        res.send({status: "succes", message:"Se crearon los siguientes usuarios",data:mocksUser});
    }catch(err){
        res.send({status:"error", data:err});
    }
}

const getMocksPets = async(req,res)=>{ 
    const cantidad = req.body.cantidad || 10;
    const mocksPet = [];
    for (let i = 0; i < cantidad; i++) {
        mocksPet.push(createMockPet());
    }
    res.send({status:"succes", data:mocksPet});
};

const getMocksUserandPets = async(req,res)=>{   
    const cantidad = req.body.cantidad || 10;
    const mocksUser = [];
    const mocksPet = [];
    try{
    for (let i = 0; i < cantidad; i++) {
        mocksUser.push(await createMockUser());
        mocksPet.push(await createMockPet());
    }
    res.send({status:"succes", data:{users:mocksUser,pets:mocksPet}});
    }catch(err){
        res.send({status:"error", data:err});
    }
}


const generateData = async(req,res)=>{
    const { users, pets } = req.body;
    const mocksUser = [];
    const mocksPet = [];

    if(users === undefined || pets === undefined){
        res.send({status:"error", message:"Faltan datos"});
        return;
    }
    try {
        for (let i = 0; i < users; i++) {
            const user = await createMockUser();
            mocksUser.push(user);
            await usersService.create(user);
        }

        for (let i = 0; i < pets; i++) {
            const pet = await createMockPet();
            mocksPet.push(pet);
            await petsService.create(mocksPet[i]);
        }

        res.send({status: "success", message: "Data generada", data: { users: mocksUser, pets: mocksPet } });
    } catch (err) {
        res.send({status: "error", data: err });
    }

};

export default {getMocksUserandPets,getMocksUsers,getMocksPets,generateData};