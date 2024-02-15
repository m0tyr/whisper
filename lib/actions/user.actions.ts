"use server"

import { connect } from "http2"
import { connectToDB } from "../mongoose"

export async function updateUser(): Promise<void> {
    connectToDB();    
}