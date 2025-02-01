"use server"

import { cookies } from "next/headers"
import { createClient } from "../supabase/server"

export interface Team {
    id: string;
    name: string;
    team_kpi: string;
    created_at: string;
}

export const getTeamProfile = async (team_id:string):Promise<Team[]> => {
    try{

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data: teamData , error: teamError} = await supabase
    .from("teams")
    .select('*')
    .eq('id',team_id)

    if (teamError){
        console.error("チーム情報fetchエラー")
        throw teamError

    }

    return teamData
    }
    catch(error){
        console.error("チーム情報が見つかりません",{error})
        throw error

    }

}