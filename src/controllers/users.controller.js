import e from "express";
import { usersService } from "../services/index.js"
import { isValidObjectId } from "mongoose";

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const getUserById = async(req,res)=>{
    const userId = req.params.uid;
    if(!userId) return res.status(400).send({status:"error",error:"Incomplete values"})
    try{
        await usersService.getUserById(userId);
        const user = await usersService.getUserById(userId);
        if(!user) return res.status(404).send({status:"error",error:"User not found"})
        res.send({status:"success",payload:user})
    }catch(err){
        return res.status(500).send({status:"error",error:"Internal Error"})
    }
}

const createUser = async(req,res)=>{    
    const user = req.body;
    if(!user.first_name || !user.last_name || !user.email || !user.password){
        return res.status(400).send({status:"error",error:"Incomplete values"})
    }
    try{
        const userExist = await usersService.getUserByEmail(user.email);
        if(userExist) return res.status(400).send({status:"error",error:"User already exists"})
        const result = await usersService.create(user);
        res.send({status:"success",payload:result})
    }catch(err){
        res.status(500).send({status:"error",error:err.message})
    }
}

const updateUser = async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    if(!isValidObjectId(userId)) return res.status(400).send({status:"error",error:"Invalid user id"})
    try{
        const user = await usersService.getUserById(userId);
        if(!user) return res.status(404).send({status:"error", error:"User not found"})
        const result = await usersService.update(userId,updateBody);
        res.send({status:"success",message:"User updated",payload:result})
    }catch(err){
        return res.status(500).send({status:"error",error:"Internal Error"})
    }
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    try{
        const user = await usersService.getUserById(userId);
        if(!user){
             return res.status(404).send({status:"error", error:"User not found"})
        }
        const result = await usersService.delete(userId);
        if(!result){
            return res.status(404).send({status:"error", error:"User not found"})
        }
        res.status(200).send({status:"success",message:"User deleted"})
    }catch(err){
        return res.status(500).send({status:"error",error:"Internal Error"})
    }
}

export default {
    deleteUser,
    getAllUsers,
    createUser,
    getUserById,
    getUser,
    updateUser
}