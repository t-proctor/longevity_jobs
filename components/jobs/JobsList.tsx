'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPinIcon, Building2Icon, FlaskConicalIcon, BriefcaseIcon, CodeIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Job {
    id: bigint
    title: string
    company: string
    location: string
    posted_at: string | null
    created_at: string
    active: boolean
    url: string
    category: 'Research/Development' | 'Business/Operations' | 'Technology/Engineering'
}

interface JobsListProps {
    jobs: Job[]
}

const getCategoryIcon = (category: Job['category']) => {
    switch (category) {
        case 'Research/Development':
            return <FlaskConicalIcon className="w-10 h-10 text-teal-500" />
        case 'Business/Operations':
            return <BriefcaseIcon className="w-10 h-10 text-teal-500" />
        case 'Technology/Engineering':
            return <CodeIcon className="w-10 h-10 text-teal-500" />
        default:
            return <FlaskConicalIcon className="w-10 h-10 text-teal-500" />
    }
}

const getDisplayDate = (job: Job) => {
    const dateString = job.posted_at || job.created_at
    return new Date(dateString).toLocaleDateString()
}

const JobsList: React.FC<JobsListProps> = ({ jobs }) => {
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const columnsPerRow = 3
    const rowsPerPage = 7  // This will give us 21 jobs per page (3 columns × 7 rows)
    const jobsPerPage = columnsPerRow * rowsPerPage
    const [searchQuery, setSearchQuery] = useState("")

    // Debugging: Log state changes
    useEffect(() => {
        console.log('Selected Locations:', selectedLocations)
        console.log('Selected Categories:', selectedCategories)
    }, [selectedLocations, selectedCategories])

    // Get unique locations for the filter dropdown
    const locations = useMemo(() => {
        const uniqueLocations = new Set(jobs.map(job => job.location));
        const sortedLocations = Array.from(uniqueLocations)
            .filter(loc => loc !== "Remote")
            .sort();
        return ["Remote", ...sortedLocations];
    }, [jobs]);

    // Get unique categories for the filter dropdown
    const categories = useMemo(() => {
        const uniqueCategories = new Set(jobs.map(job => job.category))
        return Array.from(uniqueCategories).sort()
    }, [jobs])

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(job.location);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category);

        return matchesSearch && matchesLocation && matchesCategory;
    });

    const totalJobs = filteredJobs.length;
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const visibleJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-5xl font-bold mb-2 text-center text-teal-800">Longevity Jobs</h1>
            <p className="text-center text-gray-600 mb-8 text-lg">Discover opportunities related to aging</p>

            {/* Filters section */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
                {/* Search Input */}
                <div className="w-[200px]">
                    <input
                        type="text"
                        placeholder="Search titles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Location Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-[200px]">
                            {selectedLocations.length === 0
                                ? "Select locations..."
                                : `${selectedLocations.length} locations`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
                        <DropdownMenuLabel>Locations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {locations.map((location) => (
                            <DropdownMenuCheckboxItem
                                key={location}
                                checked={selectedLocations.includes(location)}
                                onCheckedChange={(checked) => {
                                    setSelectedLocations((prev) =>
                                        checked
                                            ? [...prev, location]
                                            : prev.filter((l) => l !== location)
                                    )
                                }}
                            >
                                {location}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Category Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-[200px]">
                            {selectedCategories.length === 0
                                ? "Select categories..."
                                : `${selectedCategories.length} categories`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Categories</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {categories.map((category) => (
                            <DropdownMenuCheckboxItem
                                key={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={(checked) => {
                                    setSelectedCategories((prev) =>
                                        checked
                                            ? [...prev, category]
                                            : prev.filter((c) => c !== category)
                                    )
                                }}
                            >
                                {category}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {(selectedLocations.length > 0 || selectedCategories.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {selectedLocations.map(location => (
                        <Badge
                            key={location}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {location}
                            <XIcon
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setSelectedLocations(prev => prev.filter(l => l !== location))}
                            />
                        </Badge>
                    ))}
                    {selectedCategories.map(category => (
                        <Badge
                            key={category}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {category}
                            <XIcon
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleJobs.map((job) => (
                    <Card key={job.id.toString()} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white border-teal-200 flex flex-col">
                        <CardContent className="p-0 flex flex-col h-full">
                            <div className="bg-gradient-to-r from-teal-400 to-blue-500 h-2"></div>
                            <div className="p-6 flex-grow">
                                <div className="flex items-center justify-between mb-4">
                                    {getCategoryIcon(job.category)}
                                    <span className="text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full">
                                        {getDisplayDate(job)}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-semibold mb-4 text-teal-800 min-h-[64px]">
                                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors duration-200">
                                        {job.title}
                                    </a>
                                </h2>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-teal-700">
                                        <Building2Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span>{job.company}</span>
                                    </div>
                                    <div className="flex items-center text-teal-700">
                                        <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center text-teal-600">
                                        <span>{job.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-teal-50 px-6 py-4 mt-auto">
                                <Button onClick={() => window.open(job.url, '_blank', 'noopener,noreferrer')} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium">
                                    View Listing
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                    <Button
                        key="prev"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                            key={`page-${pageNum}`}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                        >
                            {pageNum}
                        </Button>
                    ))}

                    <Button
                        key="next"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}

export default JobsList
