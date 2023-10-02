import React, { useEffect, useState } from 'react';
import { MdOutlineDateRange } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { BsSearch } from 'react-icons/bs';
import { DateRange } from 'react-date-range';
import { format, set } from 'date-fns';

const Filter = ({setProjectLogs, setOpenFilterModal, projectId, setTotalLogs, currentPage, logStatus}) => {
    const [openPersonSearchModal, setOpenPersonSearchModal] = useState(false)
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false)
    const [dateChanged, setDateChanged] = useState(false)
    const [date, setDate] = useState([{
        startDate: new Date(),
        endDate: new Date(),  //addDays(new Date(), 7)
        key: 'selection'
    }]);
    const [allUpcomingStart, setAllUpcomingStart] = useState()
    const [allUpcomingEnd, setAllUpcomingEnd] = useState()
    const [overDueStart, setOverDueStart] = useState()
    const [overDueEnd, setOverDueEnd] = useState()

    const [descriptionContent, setDescriptionContent] = useState('')
    const [logType, setLogType] = useState(null)
    const [logTags, setLogTags] = useState()
    const [assignedSearch, setAssignedSearch] = useState('')
    const [assignedData, setAssignedData] = useState()
    const [assignedName, setAssignedName] = useState('')
    const [assignedImage, setAssignedImage] = useState('')
    const [assingedPersonId, setAssingedPersonId] = useState('')

    const handleFilter = () => {
        const filterObj = {
            projectId: projectId,
            startDate: dateChanged ? format(new Date(date[0].startDate), "y-MM-dd") : '',
            endDate: dateChanged ? format(new Date(date[0].endDate), "y-MM-dd") : '',
            allUpcomingStart: allUpcomingStart ? allUpcomingStart : '',
            allUpcomingEnd: allUpcomingEnd ? allUpcomingEnd : '',
            overDueStart: overDueStart ? overDueStart : '',
            overDueEnd: overDueEnd ? overDueEnd : '',
            descriptionContent: descriptionContent,
            logTypeToFilter: logType,
            logTagsToFilter: logTags ? [logTags] : '',
            assignedPersonId: assingedPersonId,
            page: currentPage,
            logStatus: logStatus
        }

        fetch('http://164.92.108.233/filter-logs', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(filterObj)
        })
            .then(res => res.json())
            .then(data => {
                setProjectLogs(data)
                setOpenFilterModal(false)
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        const filterObj = {
            projectId: projectId,
            startDate: dateChanged ? format(new Date(date[0].startDate), "y-MM-dd") : '',
            endDate: dateChanged ? format(new Date(date[0].endDate), "y-MM-dd") : '',
            allUpcomingStart: allUpcomingStart ? allUpcomingStart : '',
            allUpcomingEnd: allUpcomingEnd ? allUpcomingEnd : '',
            overDueStart: overDueStart ? overDueStart : '',
            overDueEnd: overDueEnd ? overDueEnd : '',
            descriptionContent: descriptionContent,
            logTypeToFilter: logType,
            logTagsToFilter: logTags ? [logTags] : '',
            assignedPersonId: assingedPersonId,
            logStatus: logStatus,
            totalLogs: true
        }

        fetch('http://164.92.108.233/filter-logs', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(filterObj)
        })
            .then(res => res.json())
            .then(data => {
                setTotalLogs(data.totalLogs)
            })
            .catch(error => console.log(error))
    }, [setTotalLogs, logStatus, allUpcomingStart, allUpcomingEnd, projectId, overDueStart, overDueEnd, descriptionContent, assingedPersonId, date, dateChanged, logTags, logType])

    useEffect(() => {
        fetch(`http://164.92.108.233/get-assigned-data?searchQuery=${assignedSearch}`)
            .then(res => res.json())
            .then(data => {
                setAssignedData(data)
            })
            .catch(error => console.log(error))
    }, [assignedSearch])

    const handleAssignData = (person) => {
        setAssignedName(person.assigned[0].name)
        setAssignedImage(person.assigned[0].image)
        setAssingedPersonId(person.assigned[0].assinged_person_id)
        setOpenPersonSearchModal(false)
    }

    const handleAllUpcoming = () => {
        setAllUpcomingStart(format(new Date(), "y-MM-dd"))
        setAllUpcomingEnd("2100-01-01")
        setOpenDateRangeModal(false)
        setDateChanged(false)

        setOverDueStart('')
        setOverDueEnd('')
    }

    const handleOverDue = () => {
        setOverDueStart("2000-01-01")
        setOverDueEnd(format(new Date(), "y-MM-dd"))
        setOpenDateRangeModal(false)
        setDateChanged(false)

        setAllUpcomingStart('')
        setAllUpcomingEnd('')
    }

    return (
        <div className='w-screen h-screen absolute top-0 left-0 bg-white'>
            <div className="relative">
                <div className='max-w-screen-xl mx-auto h-screen p-12 relative'>
                    <span onClick={() => setOpenFilterModal(false)} className='absolute top-10 right-10 cursor-pointer'><IoClose size={50} /></span >
                    <div className='py-3 w-fit mx-auto flex items-center font-semibold text-[#A8A8A8] border border-[#CBCBCB] rounded-2xl mb-20'>
                        <div className='px-20'>
                            {(allUpcomingStart) ? format(new Date(allUpcomingStart), "dd/MM/y") : (overDueStart) ? format(new Date(overDueStart), "dd/MM/y") : format(new Date(date[0].startDate), "dd/MM/y")} - {(allUpcomingEnd) ? format(new Date(allUpcomingEnd), "dd/MM/y") : (overDueEnd) ? format(new Date(overDueEnd), "dd/MM/y") : format(new Date(date[0].endDate), "dd/MM/y")}
                        </div>
                        <div className='w-1 h-8 border-l border-black'></div>
                        <div onClick={() => setOpenDateRangeModal(true)} className='px-16 cursor-pointer'><MdOutlineDateRange size={28} /></div>
                    </div>

                    <div className='mb-16 space-y-12'>
                        <div className="mb-6">
                            <input onChange={(e) => setDescriptionContent(e.target.value)} type="text" id="description" className="block w-full p-5 text-xl text-gray-900 border border-[#948C8C] rounded-lg bg-gray-50 placeholder:text-[#ABABAB] placeholder:text-xl focus:outline-none" placeholder='Description' />
                        </div>
                        <div className="mb-6">
                            <input onChange={(e) => setLogTags(e.target.value.toLowerCase())} type="text" id="tags" className="block w-full p-5 text-xl text-gray-900 border border-[#948C8C] rounded-lg bg-gray-50 placeholder:text-[#ABABAB] placeholder:text-xl focus:outline-none" placeholder='Tags' />
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <div>
                            <p className='text-2xl font-semibold mb-2'>Project Type</p>
                            <div className="flex items-center mb-4">
                                <input onChange={() => setLogType("Risk")} id="risk" type="radio" value="" name="project-radio" className="w-6 h-6 text-[#30FFE4] bg-[#30FFE4] border border-[#30FFE4] cursor-pointer" />
                                <label htmlFor="risk" className="ml-2 mt-1 text-2xl font-semibold text-[#FF1515] cursor-pointer">Risk</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input onChange={() => setLogType("Action")} id="action" type="radio" value="" name="project-radio" className="w-6 h-6 text-[#30FFE4] bg-[#30FFE4] border border-[#30FFE4] cursor-pointer" />
                                <label htmlFor="action" className="ml-2 mt-1 text-2xl font-semibold text-[#FF9330] cursor-pointer">Action</label>
                            </div>
                        </div>
                        <div>
                            <p className='text-2xl font-semibold mb-2'>Person Assigned</p>
                            <div onClick={() => setOpenPersonSearchModal(true)} className='py-2 pl-3 pr-8 min-w-[204px] max-w-fit mx-auto flex gap-4 items-center font-semibold text-[#A8A8A8] border border-[#CBCBCB] rounded-2xl cursor-pointer'>
                                {assignedImage ? <img className="w-8 h-8 rounded-full " src={`http://164.92.108.233/images/${assignedImage}`} alt="" /> : <img className="w-8 h-8 rounded-full " src="/image_avatar.png" alt="" />}
                                {assignedName ? <p>{assignedName}</p> : <p>Mr. Jonas Doe</p>}
                            </div>
                        </div>
                    </div>

                    <div className='text-center mt-5'>
                        <button onClick={handleFilter} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold btn-shadow'>Filter</button>
                    </div>
                </div>

                {/* search person modal */}
                {
                    openPersonSearchModal && <div onClick={() => setOpenPersonSearchModal(false)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                        <div onClick={(event) => { event.stopPropagation() }} data-aos="zoom-in" className='relative custom-shadow rounded-2xl overflow-hidden w-[400px] h-[500px] bg-[#ffffff]'>
                            <div className="relative border-b bg-red-500">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                    <BsSearch className='text-[#9F9F9F]' />
                                </div>
                                <input onChange={(e) => setAssignedSearch(e.target.value)} type="search" id="search" className="block w-full p-3 pt-4 pl-8 text-sm focus:outline-none placeholder:text-[#9F9F9F]" placeholder="Search" required />
                            </div>

                            {/* modal body */}
                            <div className="px-6 py-3 space-y-5 h-[420px] overflow-y-auto">
                                {
                                    assignedData?.map((person, index) => <div onClick={() => handleAssignData(person)} key={index} className='flex gap-2 items-center cursor-pointer'>
                                        <img className="w-8 h-8 rounded-full " src={`http://164.92.108.233/images/${person.assigned[0].image}`} alt="" />
                                        <p>{person.assigned[0].name}</p>
                                    </div>)
                                }
                            </div>
                        </div>
                    </div>
                }

                {/* date range modal */}
                {
                    openDateRangeModal && <div className='absolute top-0 left-0 w-full h-full bg-[#ffffff]'>
                        <div className="max-w-7xl mx-auto px-12 py-20">
                            <div className='flex justify-between items-center mb-8'>
                                <button onClick={handleAllUpcoming} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold btn-shadow'>All Upcoming</button>
                                <button onClick={handleOverDue} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold btn-shadow'>Over Due</button>
                            </div>

                            {/* main date range div */}
                            <div className='mb-10'>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={item => {
                                        setDateChanged(true)
                                        setAllUpcomingStart('')
                                        setAllUpcomingEnd('')
                                        setOverDueStart('')
                                        setOverDueEnd('')
                                        setDate([item.selection])
                                    }}
                                    moveRangeOnFirstSelection={false}
                                    months={2}
                                    ranges={date}
                                    direction="horizontal"
                                    rangeColors={["#30FFE4"]}
                                    color="#3d91ff"
                                />
                            </div>

                            <div className='text-center'>
                                <button onClick={() => setOpenDateRangeModal(false)} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold btn-shadow'>Select Range</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Filter;