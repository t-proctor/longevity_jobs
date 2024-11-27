import JobsList from "@/components/jobs/JobsList"
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge';  // Add this line

export default async function JobsPage() {
    const supabase = await createClient()
    const { data: jobs, error } = await supabase.from("jobs").select("*").eq('active', true).order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching jobs:", error.message)
        return <div>Failed to load jobs.</div>
    }

    return <JobsList jobs={jobs || []} />
}