'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPinIcon, Building2Icon, DnaIcon } from 'lucide-react'

interface Job {
    id: bigint
    title: string
    company: string
    location: string
    posted_at: string // Adjusted to match the 'posted_at' field in the DB
    active: boolean
    url: string
}

interface JobsListProps {
    jobs: Job[]
}

const JobsList: React.FC<JobsListProps> = ({ jobs }) => {
    const [filter, setFilter] = useState('all')

    const filteredJobs = useMemo(() => {
        let sorted = [...jobs]
        if (filter === 'recent') {
            sorted.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime())
        }
        return sorted
    }, [filter, jobs])

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-2 text-center text-teal-800">Longevity Biotech Careers</h1>
                <p className="text-xl text-center mb-8 text-teal-600">Shaping the Future of Human Health</p>

                <div className="mb-8 flex justify-between items-center">
                    <p className="text-teal-700 text-lg">Discover groundbreaking opportunities in age-related research</p>
                    <Select onValueChange={(value) => setFilter(value)}>
                        <SelectTrigger className="w-[180px] border-teal-300">
                            <SelectValue placeholder="Filter jobs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Jobs</SelectItem>
                            <SelectItem value="recent">Most Recent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <Card key={job.id.toString()} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white border-teal-200">
                            <CardContent className="p-0">
                                <div className="bg-gradient-to-r from-teal-400 to-blue-500 h-2"></div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <DnaIcon className="w-10 h-10 text-teal-500" />
                                        <span className="text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full">
                                            {new Date(job.posted_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-2 text-teal-800">
                                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors duration-200">
                                            {job.title}
                                        </a>
                                    </h2>
                                    <div className="flex items-center text-teal-700 mb-2">
                                        <Building2Icon className="w-4 h-4 mr-2" />
                                        <span>{job.company}</span>
                                    </div>
                                    <div className="flex items-center text-teal-700">
                                        <MapPinIcon className="w-4 h-4 mr-2" />
                                        <span>{job.location}</span>
                                    </div>
                                </div>
                                <div className="bg-teal-50 px-6 py-4">
                                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="font-medium">
                                            View Position
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default JobsList
