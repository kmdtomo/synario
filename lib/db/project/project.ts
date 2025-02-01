"use server"

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import { error } from "console";

export interface Project {
    id: string;
    team_id: string;
    name: string;
    trigger: string;
    vision: string;
    unite: string;
    achieve: string;
    goal: string;
}

export const getProjectProfile = async (project_id:string):Promise<Project[]> => {
    try{

        const cookieStore = await cookies()
        const supabase = await createClient(cookieStore)

        const {data:projectData , error:projectError} = await supabase
        .from("projects")
        .select("*")
        .eq("id",project_id)

        if(projectError){
            console.error("データ取得エラー",error)
            throw error
        }

        return projectData

    }catch(error){
    console.error("プロジェクトがありません：",error)
    throw error

    }

}