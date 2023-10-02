import React, { useEffect, useState } from 'react';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { FaFileDownload } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import { VscSettings } from 'react-icons/vsc';
import { AiOutlineClear } from 'react-icons/ai';
import { Link, useLocation, useParams } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns'
import Filter from '../Filter/Filter';
import ClipLoader from 'react-spinners/ClipLoader';

const ProjectLogs = () => {
    const [loading, setLoading] = useState(true)
    const [projectLogs, setProjectLogs] = useState([])
    const [refetch, setRefetch] = useState(false)

    const [openFilterModal, setOpenFilterModal] = useState(false)
    const [OpneCreateLogModal, setOpenCreateLogModal] = useState(false)
    const [openTaskTypeModal, setOpenTaskTypeModal] = useState(false)
    const [openRiskLogModal, setOpenRiskLogModal] = useState(false)
    const [openActionLogModal, setOpenActionLogModal] = useState(false)
    const [openRiskPersonSearchModal, setOpenRiskPersonSearchModal] = useState(false)
    const [openActionPersonSearchModal, setOpenActionPersonSearchModal] = useState(false)
    const [openRiskCreateUserModal, setOpenRiskCreateUserModal] = useState(false)
    const [openActionCreateUserModal, setOpenActionCreateUserModal] = useState(false)
    const [logConfirmationModal, setLogConfirmationModal] = useState(false)

    const [logStatus, setLogStatus] = useState('open')
    const [logName, setLogName] = useState('')
    const [logDueDate, setLogDueDate] = useState()
    const [taskType, setTaskType] = useState('')
    const [riskDescription, setRiskDescription] = useState()
    const [controlDescription, setControlDescription] = useState()
    const [descriptionDate, setDescriptionDate] = useState()
    const [assignedName, setAssignedName] = useState('')
    const [logTags, setLogTags] = useState([])
    const [tag, setTag] = useState('')
    const [imageFile, setImageFile] = useState()
    const [sendImageFile, setSendImageFile] = useState()
    const [assignedSearch, setAssignedSearch] = useState('')
    const [assignedData, setAssignedData] = useState([])
    const [assignedImage, setAssignedImage] = useState('')
    const [assingedPersonId, setAssingedPersonId] = useState('')
    const [uploadImage, setUploadImage] = useState(true)

    const { id } = useParams()
    const location = useLocation()

    // pagination related works
    const [currentPage, setCurrentPage] = useState(1)
    const [totalLogs, setTotalLogs] = useState(0)
    const pages = Math.ceil(totalLogs / 4)
    const pagesNumber = totalLogs && [...Array(pages).keys()]

    useEffect(() => {
        fetch(`http://localhost:5000/total-logs/${id}?logStatus=${logStatus}`)
            .then(res => res.json())
            .then(data => {
                setTotalLogs(data.totalLogs)
            })
    }, [id, refetch, logStatus])

    useEffect(() => {
        setLoading(true)
        setProjectLogs([])

        fetch(`http://localhost:5000/single-project/${id}?page=${currentPage}&logStatus=${logStatus}`)
            .then(res => res.json())
            .then(data => {
                setProjectLogs(data)
                setLoading(false)
            })
            .catch(error => console.log(error))
    }, [refetch, id, currentPage, logStatus, setProjectLogs]);

    useEffect(() => {
        fetch(`http://localhost:5000/get-assigned-data?searchQuery=${assignedSearch}`)
            .then(res => res.json())
            .then(data => {
                setAssignedData(data)
            })
            .catch(error => console.log(error))
    }, [assignedSearch, refetch])

    const handleSubmit = () => {
        setLogConfirmationModal(true)
        const logId = uuidv4();

        const riskDesc = {
            risk_description: [{ content: riskDescription, date: descriptionDate, id: uuidv4() }],
            control_description: [{ content: controlDescription, date: descriptionDate, id: uuidv4() }]
        }

        const actionDesc = {
            action_description: [{ content: riskDescription, date: descriptionDate, id: uuidv4() }],
            control_description: [{ content: controlDescription, date: descriptionDate, id: uuidv4() }]
        }

        const logData = { log_name: logName, log_id: logId, log_description: taskType === 'Risk' ? riskDesc : actionDesc, log_type: taskType, log_due_date: logDueDate, log_status: logStatus, log_tags: logTags, assigned: uploadImage ? [] : [{ name: assignedName, image: assignedImage, assinged_person_id: assingedPersonId }] }

        fetch('http://localhost:5000/add-log', {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id, logData })
        })
            .then(res => res.json())
            .then(data => {
                setRefetch(!refetch)
                setAssignedName('')
                setAssignedSearch('')
                setLogTags([])

                const formData = new FormData()
                formData.append('image', sendImageFile)

                if (uploadImage) {
                    fetch(`http://localhost:5000/uploadImage?name=${assignedName}&id=${uuidv4()}&projectId=${id}&logId=${logId}`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'enctype': 'multipart/form-data',
                        },
                    })
                        .then((response) => {
                            setRefetch(!refetch)
                        })
                }
            })
            .catch(error => console.log(error))
    }

    const handleCreateNewLog = () => {
        setLogConfirmationModal(false)
        setOpenRiskLogModal(false)
        setOpenActionLogModal(false)
        setOpenCreateLogModal(true)
    }

    const handleNotCreateNewLog = () => {
        setLogConfirmationModal(false)
        setOpenRiskLogModal(false)
        setOpenActionLogModal(false)
    }

    const handleImage = (e) => {
        setSendImageFile(e.target.files[0])
        setImageFile(URL.createObjectURL(e.target.files[0]))

        setUploadImage(true)
        setAssignedImage('')
    }

    const handleAssignData = (person) => {
        setAssignedName(person.assigned[0].name)
        setAssignedImage(person.assigned[0].image)
        setAssingedPersonId(person.assigned[0].assinged_person_id)
        setOpenRiskPersonSearchModal(false)
        setOpenActionPersonSearchModal(false)

        setImageFile('')
        setUploadImage(false)
    }

    const downloadPDF = () => {
        fetch('http://localhost:5000/download-logs-pdf', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(projectLogs)
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.blob();
                } else {
                    throw new Error('Failed to download PDF');
                }
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'log_data.pdf';
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const downloadExcel = () => {
        fetch('http://localhost:5000/download-logs-excel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectLogs),
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.blob();
                } else {
                    throw new Error('Failed to download Excel file');
                }
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'logs.xlsx';
                a.click();

                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className='max-w-screen-xl mx-auto h-screen p-12'>
            <div className='flex items-center justify-between mb-20'>
                <Link to="/">
                    <FaAnglesLeft size={24} />
                </Link>
                <h3 className='text-4xl font-bold ml-28'>Logs</h3>
                <div className='flex gap-5'>
                    <span onClick={downloadExcel} className='p-3 custom-shadow rounded-full cursor-pointer'><RiFileExcel2Fill size={24} /></span>
                    <span onClick={downloadPDF} className='p-3 custom-shadow rounded-full cursor-pointer'><FaFileDownload size={24} /></span>
                    <Link to="/setting" state={{ from: location }} className='p-3 custom-shadow rounded-full cursor-pointer'><IoSettingsSharp size={24} /></Link>
                </div>
            </div>

            <div className='flex justify-between items-center mb-10'>
                <div className='flex gap-5 items-center'>
                    <button onClick={() => setOpenFilterModal(true)} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold btn-shadow flex gap-2 items-center'><VscSettings size={20} /><div>Filter</div></button>
                    <button onClick={() => setRefetch(!refetch)} className='py-3 px-14 border border-[#CBCBCB] rounded-2xl font-semibold flex gap-2 items-center'><AiOutlineClear size={20} /><div>Clear</div></button>
                </div>
                <div className='border rounded-2xl overflow-hidden btn-shadow border-[#30FFE4]'>
                    <button onClick={() => setLogStatus('open')} className={`py-3.5 px-10 text-sm font-semibold ${logStatus === 'open' && 'bg-[#30FFE4]'}`}>Open</button>
                    <button onClick={() => setLogStatus('closed')} className={`py-3.5 px-10 text-sm font-semibold ${logStatus === 'closed' && 'bg-[#30FFE4]'}`}>Closed</button>
                </div>
                <button onClick={() => setOpenCreateLogModal(true)} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold btn-shadow flex gap-2 items-center'><MdAdd size={22} /><div>Add Log</div></button>
            </div>

            <div className='space-y-12'>
                {
                    projectLogs?.map((log, index) => <Link to={`/logs/log/${log.log_id}?projectId=${id}`} state={{ from: location }} key={index}>
                        <div className='px-8 py-4 flex justify-between items-center text-center rounded-2xl custom-shadow mb-12'>
                            <div className='text-lg font-medium w-1/4'>
                                <p>Due Data</p>
                                <p>{format(new Date(log.log_due_date), "y/MM/dd")}</p>
                            </div>
                            <div>
                                <p className='text-lg font-medium w-1/4'>Assigned</p>
                                <div className="flex -space-x-4">
                                    <img className="w-8 h-8 mx-auto border-2 border-white rounded-full " src={`http://localhost:5000/images/${log.assigned[0]?.image}`} alt="" />
                                </div>
                            </div>
                            <div className='w-1/4'>
                                <p className='text-xl font-medium'>Description</p>
                                <p className='text-lg font-medium'>
                                    {
                                        log.log_type === 'Risk' ? log?.log_description?.risk_description[0]?.content : log?.log_description?.action_description[0]?.content
                                    }
                                </p>
                            </div>
                            <div className='w-1/4'>
                                <p className='text-xl font-medium'>Type</p>
                                <p className='text-lg font-medium  text-[#FF1515]'>{log.log_type}</p>
                            </div>
                        </div>
                    </Link>)
                }

                {
                    !projectLogs?.length && !loading && <p className='text-3xl font-medium text-gray-400 text-center mt-[250px]'>No logs added yet!</p>
                }
                
                {/* loader / spinner */}
                <div className='flex justify-center mt-[250px]'>
                    <ClipLoader color="#000000" loading={loading} size={50} />
                </div>
            </div>

            {/* pagination */}
            {
                totalLogs > 4 && <div className='w-fit absolute left-1/2 right-1/2 transform translate-x-[-50%] -translate-y-[-50%] bottom-20 mx-auto rounded-full custom-shadow flex items-center gap-5 font-semibold text-xl'>
                    <span className='px-5 h-12 rounded-full border cursor-pointer border[#ADADAD] flex items-center justify-center'><FaAnglesLeft size={24} /></span>
                    {
                        pagesNumber.map(page => <button onClick={() => setCurrentPage(page + 1)} key={page} className={currentPage === page + 1 ? 'text-black text-opacity-100' : 'text-black text-opacity-20'}> {page + 1} </button>)
                    }
                    <span className='px-5 h-12 rounded-full border cursor-pointer border[#ADADAD] flex items-center justify-center'><FaAnglesRight size={24} /></span>
                </div>
            }

            {/* create log modal */}
            {
                OpneCreateLogModal && <div onClick={() => setOpenCreateLogModal(false)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                    <div onClick={(event) => { event.stopPropagation() }} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                        <input onChange={(e) => setLogName(e.target.value)} className='w-3/5 my-3 p-2 border border-[#ddd] focus:outline-none' placeholder='Give a name' type="text" />
                        <input onChange={(e) => {
                            const inputValue = new Date(e.target.value)
                            const isoDate = inputValue.toISOString()
                            setLogDueDate(isoDate)
                        }} className='w-3/5 my-3 p-2 border border-[#ddd] text-[#A8A8A8] focus:outline-none' type="date" />

                        <button onClick={() => {
                            if (logName && logDueDate) {
                                setOpenCreateLogModal(false)
                                setOpenTaskTypeModal(true)
                            }

                        }} className='mt-10 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Create</button>
                    </div>
                </div>
            }

            {/* select task type modal */}
            {
                openTaskTypeModal && <div onClick={() => setOpenTaskTypeModal(false)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                    <div onClick={(event) => { event.stopPropagation() }} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[80px] bg-[#fff] flex justify-center items-center flex-col'>
                        <p className='text-3xl font-medium'>Select Your Task Type:</p>
                        <div className='flex items-center gap-10'>
                            <button onClick={() => {
                                setOpenTaskTypeModal(false)
                                setOpenRiskLogModal(true)
                                setTaskType("Risk")
                            }} className='mt-10 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Risk</button>
                            <button onClick={() => {
                                setOpenTaskTypeModal(false)
                                setOpenActionLogModal(true)
                                setTaskType("Action")
                            }} className='mt-10 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Action</button>
                        </div>
                    </div>
                </div>
            }

            {/* risk log detail modal */}
            {
                openRiskLogModal && <div className='absolute top-0 left-0 w-full h-full bg-[#ffffff]'>
                    <div className="max-w-7xl mx-auto p-12">
                        <h3 className='text-4xl font-bold text-center mb-20'>Logs</h3>

                        <div className='flex justify-between'>
                            <div className='w-1/2'>
                                <p className='text-xl text-[#A9A9A9] font-semibold'>Types/<span className='text-[#FF1515]'>Risk</span></p>
                                <div className='mt-2 mb-12'>
                                    <label htmlFor="message" className="block mb-2 text-xl font-semibold text-gray-900">Risk Description</label>
                                    <textarea onChange={(e) => setRiskDescription(e.target.value)} id="message" rows="7" className="block p-2.5 w-3/4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-[#CBCBCB] focus:outline-none"></textarea>
                                </div>
                                <div className='mt-2 mb-12'>
                                    <label htmlFor="message" className="block mb-2 text-xl font-semibold text-gray-900">Control Description</label>
                                    <textarea onChange={(e) => setControlDescription(e.target.value)} id="message" rows="7" className="block p-2.5 w-3/4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-[#CBCBCB] focus:outline-none"></textarea>
                                </div>
                            </div>

                            <div>
                                <div className='space-y-8'>
                                    <div>
                                        <p className='mb-2 text-xl font-semibold text-gray-900'>Due Date</p>
                                        <div className="mb-6">
                                            <input onChange={(e) => {
                                                const inputValue = new Date(e.target.value)
                                                const isoDate = inputValue.toISOString()
                                                setDescriptionDate(isoDate)
                                            }} type="date" id="tags" className="block w-full p-5 text-xl border border-[#CBCBCB] rounded-2xl text-[#ABABAB] placeholder:text-xl focus:outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className='mb-2 text-xl font-semibold text-gray-900'>Person Assigned</p>
                                        <div onClick={() => setOpenRiskPersonSearchModal(true)} className='py-5 pl-3 pr-8 w-full flex gap-4 items-center font-semibold text-xl text-[#A8A8A8] border border-[#CBCBCB] rounded-2xl cursor-pointer'>
                                            {imageFile || assignedImage ? <img className="w-8 h-8 rounded-full " src={assignedImage ? `http://localhost:5000/images/${assignedImage}` : imageFile} alt="" /> : <img className="w-8 h-8 rounded-full " src="/image_avatar.png" alt="" />}

                                            {assignedName ? <p>{assignedName}</p> : <p>Mr. Jonas Doe</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <p className='mb-2 text-xl font-semibold text-gray-900'>Tag</p>
                                        <div className="mb-6 relative">
                                            <input onChange={(e) => setTag(e.target.value.toLowerCase())} value={tag} type="text" id="tags" className="block w-full p-5 text-xl border border-[#CBCBCB] rounded-2xl text-[#ABABAB] placeholder:text-xl focus:outline-none" />
                                            {
                                                tag && <span onClick={() => {
                                                    setLogTags((prev) => [...prev, tag])
                                                    setTag('')
                                                }} className='absolute top-[18px] cursor-pointer right-3 py-2 px-3 text-xs rounded-lg bg-gray-300'>Add</span>
                                            }
                                            <div className='mt-5 space-x-2'>
                                                {logTags?.map(tag => <span key={tag} className='bg-gray-200 py-2 px-3 text-xs rounded-lg'>{tag}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleSubmit} disabled={!riskDescription || !controlDescription || !descriptionDate || !assignedName || !logTags.length} className='mt-20 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                openRiskPersonSearchModal && <div onClick={() => setOpenRiskPersonSearchModal(false)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                    <div onClick={(event) => { event.stopPropagation() }} data-aos="zoom-in" className='relative custom-shadow rounded-2xl overflow-hidden w-[400px] h-auto bg-[#ffffff]'>
                        <div className="relative border-b bg-red-500">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                <BsSearch className='text-[#9F9F9F]' />
                            </div>
                            <input onChange={(e) => setAssignedSearch(e.target.value)} type="search" id="search" className="block w-full p-3 pt-4 pl-8 text-sm focus:outline-none placeholder:text-[#9F9F9F]" placeholder="Search" required />
                        </div>

                        {/* modal body */}
                        <div className="px-6 py-3 space-y-5 h-[220px] overflow-y-auto">
                            {
                                assignedData?.map((person, index) => <div onClick={() => handleAssignData(person)} key={index} className='flex gap-2 items-center cursor-pointer'>
                                    <img className="w-8 h-8 rounded-full " src={`http://localhost:5000/images/${person.assigned[0]?.image}`} alt="" />
                                    <p>{person.assigned[0]?.name}</p>
                                </div>)
                            }
                        </div>

                        <div className='text-center'>
                            <button onClick={() => {
                                setOpenRiskPersonSearchModal(false)
                                setOpenRiskCreateUserModal(true)
                            }} className='my-8 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Create +</button>
                        </div>
                    </div>
                </div>
            }
            {
                openRiskCreateUserModal && <div onClick={() => setOpenRiskCreateUserModal(false)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                    <div onClick={(event) => { event.stopPropagation() }} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                        <input onChange={(e) => setAssignedName(e.target.value)} className='w-3/5 my-3 p-2 border border-[#ddd] placeholder:text-[#A8A8A8] text-center focus:outline-none' placeholder='Give a name' type="text" />

                        <div className='overflow-hidden object-cover w-[140px] h-auto relative flex items-center justify-center text-center bg-[#a8a8a8b6]  text-[#A8A8A8]  my-5'>

                            {imageFile ? <img width="150px" height="auto" className='' src={imageFile} /> : <div className='flex items-center justify-center w-[140px] min-h-[100px]'>Photo <br /> Not Selected</div>}

                        </div>

                        <input
                            className="relative m-0 block w-1/2 min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                            onChange={handleImage} name="image" type="file" accept='image/*'
                        />

                        <button onClick={() => {
                            if (assignedName && imageFile) {
                                setOpenRiskCreateUserModal(false)
                            }
                        }} className='mt-8 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Create</button>
                    </div>
                </div>
            }


            {/* action log detail modal */}
            {
                openActionLogModal && <div className='absolute top-0 left-0 w-full h-full bg-[#ffffff]'>
                    <div className="max-w-7xl mx-auto p-12">
                        <h3 className='text-4xl font-bold text-center mb-20'>Logs</h3>

                        <div className='flex justify-between'>
                            <div className='w-1/2'>
                                <p className='text-xl text-[#A9A9A9] font-semibold'>Types/<span className='text-[#FF1515]'>Action</span></p>
                                <div className='mt-2 mb-12'>
                                    <label htmlFor="message" className="block mb-2 text-xl font-semibold text-gray-900">Action Description</label>
                                    <textarea onChange={(e) => setRiskDescription(e.target.value)} id="message" rows="7" className="block p-2.5 w-3/4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-[#CBCBCB] focus:outline-none"></textarea>
                                </div>
                                <div className='mt-2 mb-12'>
                                    <label htmlFor="message" className="block mb-2 text-xl font-semibold text-gray-900">Control Description</label>
                                    <textarea onChange={(e) => setControlDescription(e.target.value)} id="message" rows="7" className="block p-2.5 w-3/4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-[#CBCBCB] focus:outline-none"></textarea>
                                </div>
                            </div>

                            <div>
                                <div className='space-y-8'>
                                    <div>
                                        <p className='mb-2 text-xl font-semibold text-gray-900'>Due Date</p>
                                        <div className="mb-6">
                                            <input onChange={(e) => {
                                                const inputValue = new Date(e.target.value)
                                                const isoDate = inputValue.toISOString()
                                                setDescriptionDate(isoDate)
                                            }} type="date" id="tags" className="block w-full p-5 text-xl border border-[#CBCBCB] rounded-2xl text-[#ABABAB] placeholder:text-xl focus:outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className='mb-2 text-xl font-semibold text-gray-900'>Person Assigned</p>
                                        <div onClick={() => setOpenActionPersonSearchModal(true)} className='py-5 pl-3 pr-8 w-full flex gap-4 items-center font-semibold text-xl text-[#A8A8A8] border border-[#CBCBCB] rounded-2xl cursor-pointer'>
                                            {imageFile || assignedImage ? <img className="w-8 h-8 rounded-full " src={assignedImage ? `http://localhost:5000/images/${assignedImage}` : imageFile} alt="" /> : <img className="w-8 h-8 rounded-full " src="/image_avatar.png" alt="" />}

                                            {assignedName ? <p>{assignedName}</p> : <p>Mr. Jonas Doe</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <p className='mb-2 text-xl font-semibold text-gray-900'>Tag</p>
                                        <div className="mb-6 relative">
                                            <input onChange={(e) => setTag(e.target.value.toLowerCase())} value={tag} type="text" id="tags" className="block w-full p-5 text-xl border border-[#CBCBCB] rounded-2xl text-[#ABABAB] placeholder:text-xl focus:outline-none" />
                                            {
                                                tag && <span onClick={() => {
                                                    setLogTags((prev) => [...prev, tag])
                                                    setTag('')
                                                }} className='absolute top-[18px] cursor-pointer right-3 py-2 px-3 text-xs rounded-lg bg-gray-300'>Add</span>
                                            }
                                            <div className='mt-5 space-x-2'>
                                                {logTags?.map(tag => <span key={tag} className='bg-gray-200 py-2 px-3 text-xs rounded-lg'>{tag}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleSubmit} disabled={!riskDescription || !controlDescription || !descriptionDate || !assignedName || !logTags.length} className='mt-20 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                openActionPersonSearchModal && <div onClick={() => setOpenActionPersonSearchModal(false)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                    <div onClick={(event) => { event.stopPropagation() }} data-aos="zoom-in" className='relative custom-shadow rounded-2xl overflow-hidden w-[400px] h-auto bg-[#ffffff]'>
                        <div className="relative border-b bg-red-500">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                <BsSearch className='text-[#9F9F9F]' />
                            </div>
                            <input onChange={(e) => setAssignedSearch(e.target.value)} type="search" id="search" className="block w-full p-3 pt-4 pl-8 text-sm focus:outline-none placeholder:text-[#9F9F9F]" placeholder="Search" required />
                        </div>

                        {/* modal body */}
                        <div className="px-6 py-3 space-y-5 h-[220px] overflow-y-auto">
                            {
                                assignedData?.map((person, index) => <div onClick={() => handleAssignData(person)} key={index} className='flex gap-2 items-center cursor-pointer'>
                                    <img className="w-8 h-8 rounded-full " src={`http://localhost:5000/images/${person.assigned[0]?.image}`} alt="" />
                                    <p>{person.assigned[0]?.name}</p>
                                </div>)
                            }
                        </div>

                        <div className='text-center'>
                            <button onClick={() => {
                                setOpenActionPersonSearchModal(false)
                                setOpenActionCreateUserModal(true)
                            }} className='my-8 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Create +</button>
                        </div>
                    </div>
                </div>
            }
            {
                openActionCreateUserModal && <div onClick={() => setOpenActionCreateUserModal(false)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                    <div onClick={(event) => { event.stopPropagation() }} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                        <input onChange={(e) => setAssignedName(e.target.value)} className='w-3/5 my-3 p-2 border border-[#ddd] placeholder:text-[#A8A8A8] text-center focus:outline-none' placeholder='Give a name' type="text" />

                        <div className='overflow-hidden object-cover w-[140px] h-auto relative flex items-center justify-center text-center bg-[#a8a8a8b6]  text-[#A8A8A8]  my-5'>

                            {imageFile ? <img width="150px" height="auto" className='' src={imageFile} /> : <div className='flex items-center justify-center w-[140px] min-h-[100px]'>Photo <br /> Not Selected</div>}

                        </div>
                        {/* <input onChange={handleImage} name="image" type="file" accept="image/*" /> */}
                        <input
                            className="relative m-0 block w-1/2 min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                            onChange={handleImage} name="image" type="file" accept='image/*'
                        />

                        <button onClick={() => {
                            if (assignedName && imageFile) {
                                setOpenActionCreateUserModal(false)
                            }
                        }} className='mt-8 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Create</button>
                    </div>
                </div>
            }


            {/* log creating confermation modal */}
            {
                logConfirmationModal && <div onClick={() => setLogConfirmationModal(false)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                    <div onClick={(event) => { event.stopPropagation() }} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[550px] h-auto py-[80px] bg-[#fff] flex justify-center items-center flex-col'>
                        <p className='text-3xl font-medium'>Do You want To create a new log?</p>
                        <div className='flex items-center gap-10'>
                            <button onClick={handleCreateNewLog} className='mt-10 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Yes</button>
                            <button onClick={handleNotCreateNewLog} className='mt-10 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>No</button>
                        </div>
                    </div>
                </div>
            }

            {/* logs filter */}
            {
                openFilterModal && <Filter setProjectLogs={setProjectLogs} projectId={id} setOpenFilterModal={setOpenFilterModal} setTotalLogs={setTotalLogs} currentPage={currentPage} logStatus={logStatus} />
            }
        </div >
    );
};

export default ProjectLogs;