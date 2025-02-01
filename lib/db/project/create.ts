"use server"

import { cookies } from "next/headers"
import { createClient } from "../supabase/server"

interface Form {
    team_id: string;
    trigger: string;
    vision: string;
    unite: string;
    achieve: string;
    goal: string;
    name: string;
}

interface Project {
    id: string;
    team_id: string;
    trigger: string;
    vision: string;
    unite: string;
    achieve: string;
    goal: string;
    name: string;
    created_at: string;
}

export const createProject = async ({team_id, trigger, vision, unite, achieve, goal, name}: Form): Promise<Project> => {
    try {
        const cookieStore = await cookies()
        const supabase = await createClient(cookieStore)

        const { data, error: projectError } = await supabase
            .from("projects")
            .insert({
                team_id,
                name,
                trigger,
                vision,
                unite,
                achieve,
                goal,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (projectError) {
            console.error("プロジェクト作成エラー", { projectError })
            throw projectError
        }

        if (!data) {
            throw new Error("プロジェクトの作成に失敗しました")
        }

        return data as Project
    } catch (error) {
        console.error("プロジェクト追加できませんでした", { error })
        throw error
    }
}