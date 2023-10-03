import { FaAnglesLeft } from 'react-icons/fa6';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdOutlineDone } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { BsSearch } from 'react-icons/bs';
import ClipLoader from 'react-spinners/ClipLoader';

const LogDetails = () => {
    const [loading, setLoading] = useState(true)
    const [log, setLog] = useState({})
    const { log_name, log_due_date, assigned, log_type, log_tags, log_description, log_status } = log;
    const [refetch, setRefetch] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [tagModal, setTagModal] = useState(false)
    const [task, setTask] = useState(false)
    const [isEdit, setIsEdit] = useState(true)
    const [tagEdit, setTagEdit] = useState(false)
    const [typeEdit, setTypeEdit] = useState(false)
    const [dueDateEdit, setDueDateEdit] = useState(false)
    const [assing, setAssing] = useState(false)
    const [descriptionEdit, setDescriptonEdit] = useState(false)
    const [personSearchEdit, setPersonSearchEdit] = useState(false)
    const [currentEditDesc, setCurrentEditDesc] = useState({})
    const [updatedDescContent, setUpdatedDescContent] = useState('')
    const [controlTaskType, setControlTaskType] = useState(false)
    const [updatedLogDueDate, setUpdatedLogDueDate] = useState('')
    const [updatedLogType, setUpdatedLogType] = useState('')
    const [updatedLogTags, setUpdatedLogTags] = useState('')
    const [assignedSearch, setAssignedSearch] = useState('')
    const [assignedData, setAssignedData] = useState()
    const [assignedName, setAssignedName] = useState('')
    const [assignedImage, setAssignedImage] = useState('')
    const [assingedPersonId, setAssingedPersonId] = useState('')

    const location = useLocation()
    const from = location.state?.from?.pathname || '/';
    const { id } = useParams()

    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('projectId');

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = yyyy + '-' + mm + '-' + dd;

    const isoDate = today.toISOString()

    const [riskDescription, setRiskDescription] = useState('')
    const [actionDescription, setActionDescription] = useState('')
    const [controlDescription, setControlDescription] = useState('')
    const [descriptionDueDate, setDescriptionDueDate] = useState(isoDate)

    useEffect(() => {
        fetch(`http://localhost:5000/get-single-log?logId=${id}&projectId=${projectId}`)
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                setLog(data)
            })
    }, [refetch, id, projectId])

    useEffect(() => {
        fetch(`http://localhost:5000/get-assigned-data?searchQuery=${assignedSearch}`)
            .then(res => res.json())
            .then(data => {
                const filteredArray = [];
                const uniqueIds = {};
                data.forEach((obj) => {
                    if (!uniqueIds[obj.assigned[0].assinged_person_id]) {
                      uniqueIds[obj.assigned[0].assinged_person_id] = true;
                      filteredArray.push(obj);
                    }
                  });
                setAssignedData(filteredArray)
                console.log(filteredArray)
            })
            .catch(error => console.log(error))
    }, [assignedSearch])

    const handleUpdateLogTags = () => {
        const tagsArray = updatedLogTags.split(',');

        const updatedTags = {
            projectId: projectId,
            logId: id,
            logTags: tagsArray
        }

        fetch('http://localhost:5000/update-log-tags', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updatedTags)
        })
            .then(res => res.json())
            .then(data => {
                setRefetch(!refetch)
                setTagEdit(false)
            })
            .catch(error => console.log(error))
    }

    const handleUpdateLogType = () => {
        const updatedType = {
            projectId: projectId,
            logId: id,
            logType: updatedLogType
        }

        fetch('http://localhost:5000/update-log-type', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updatedType)
        })
            .then(res => res.json())
            .then(data => {
                setRefetch(!refetch)
                setTagEdit(false)
            })
            .catch(error => console.log(error))
    }

    const handleUpdateDueDate = () => {
        const isoDueDate = new Date(updatedLogDueDate).toISOString()

        const updatedDueDate = {
            projectId: projectId,
            logId: id,
            logDueDate: isoDueDate
        }

        fetch('http://localhost:5000/update-log-due-date', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updatedDueDate)
        })
            .then(res => res.json())
            .then(data => {
                setRefetch(!refetch)
                setDueDateEdit(false)
            })
            .catch(error => console.log(error))
    }

    const handleAssingUpdate = () => {

    }

    const handleAssignData = (person) => {
        setAssignedName(person.assigned[0].name)
        setAssignedImage(person.assigned[0].image)
        setAssingedPersonId(person.assigned[0].assinged_person_id)
    }

    useEffect(() => {
        if (assignedImage && assignedName && assingedPersonId) {
            const updatedPerson = {
                projectId: projectId,
                logId: id,
                assigned: [{
                    image: assignedImage,
                    name: assignedName,
                    assinged_person_id: assingedPersonId
                }]
            }

            fetch('http://localhost:5000/update-assigned-data', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updatedPerson)
            })
                .then(res => res.json())
                .then(data => {
                    setRefetch(!refetch)
                    setPersonSearchEdit(false)
                })
                .catch(error => console.log(error))
        }
    }, [assignedImage, assignedName, assingedPersonId, id, projectId])

    const handleAddDescription = () => {

        const riskDescriptionObj = {
            content: riskDescription,
            date: descriptionDueDate,
            id: uuidv4()
        }
        const actionDescriptionObj = {
            content: actionDescription,
            date: descriptionDueDate,
            id: uuidv4()
        }
        const controlDescriptionObj = {
            content: controlDescription,
            date: descriptionDueDate,
            id: uuidv4()
        }

        const descriptions = {
            riskDescriptionObj,
            actionDescriptionObj,
            controlDescriptionObj,
            taskType: log_type,
            projectId: projectId,
            logId: id
        }

        fetch('http://localhost:5000/add-descriptions', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(descriptions)
        })
            .then(res => res.json())
            .then(data => {
                setRefetch(!refetch)
                setIsUpdate(!isUpdate)
            })
            .catch(error => console.log(error))
    }

    const handleUpdateDescription = () => {
        const updatedDescription = {
            projectId: projectId,
            logId: id,
            descriptionId: currentEditDesc.id,
            taskType: controlTaskType ? "Control" : log_type,
            descriptionContent: updatedDescContent
        }

        fetch('http://localhost:5000/update-single-description', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updatedDescription)
        })
            .then(res => res.json())
            .then(data => {
                setRefetch(!refetch)
                setDescriptonEdit(false)
                setControlTaskType(false)
            })
            .catch(error => console.log(error))
    }

    const handleLogStatus = () => {
        const body = {
            projectId: projectId,
            logId: id,
        }

        fetch('http://localhost:5000/update-log-status', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(data => {
                setTask(!task)
                setRefetch(!refetch)
            })
            .catch(error => console.log(error))
    }

    return (
        <section>
            {loading && <div className='z-10 absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-white'>
                <ClipLoader color="#000000" loading={loading} size={50} />
            </div>}

            <div className='max-w-7xl mx-auto relative w-full h-full p-12'>
                <div className='grid grid-cols-3'>
                    {isUpdate ? <div onClick={() => setIsUpdate(false)} className='cursor-pointer'><FaAnglesLeft size={24} /></div> : <Link to={from} onClick={() => setIsUpdate(false)} className='cursor-pointer'><FaAnglesLeft size={24} /></Link>}

                    <div><h1 className='text-4xl font-bold text-center'>{log_name}</h1></div>
                    {!isUpdate == false || isEdit && <div className='flex justify-end'>
                        <div onClick={() => setIsUpdate(!isUpdate)} className='ml-10  flex justify-center items-center w-12 h-12  custom-shadow rounded-full right-12 cursor-pointer'><AiOutlinePlus size={22} /></div>
                        {log_status === "open" && <div onClick={() => setTask(!task)} className='ml-10  flex justify-center items-center w-12 h-12  custom-shadow rounded-full right-12 cursor-pointer'><MdOutlineDone size={22} /></div>}
                        <div onClick={() => setIsEdit(!isEdit)} className='ml-10  flex justify-center items-center w-12 h-12  custom-shadow  rounded-full right-12 cursor-pointer'><FiEdit size={22} /></div>
                    </div>}
                </div>
                {isUpdate ?
                    <div>
                        <div className='mt-20'>
                            <h1 className='mb-3 text-3xl'>{log_type} Description</h1>
                            <textarea onChange={(e) =>
                                log_type === "Risk" ? setRiskDescription(e.target.value) : setActionDescription(e.target.value)
                            } className='w-full p-2 text-xl border border-[#ddd] focus:outline-none' name="" id="" cols="50" rows="1"></textarea>
                            <h1 className='mb-3 text-3xl mt-10'>Control Description</h1>
                            <textarea onChange={(e) => setControlDescription(e.target.value)} className='w-full p-2 text-xl border border-[#ddd] focus:outline-none' name="" id="" cols="50" rows="1"></textarea>
                        </div>
                        <div className='mt-12'>
                            <p className='text-xl mb-6'>Date (Optional)</p>
                            <input onChange={(e) => {
                                const inputValue = new Date(e.target.value)
                                const isoDate = inputValue.toISOString()
                                setDescriptionDueDate(isoDate)
                            }} className='border border-[#ddd] p-3 rounded-xl focus:outline-none' defaultValue={formattedToday} type="date" />
                        </div>
                        <div><button onClick={handleAddDescription} className='block ml-auto bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold'>Add</button></div>
                    </div>

                    :
                    <>
                        <div className='grid grid-cols-4 mt-20 mb-16 gap-4'>
                            <div className={!isEdit ? 'relative border-2 border-[#00000066] p-2 rounded-xl' : ''}>
                                {!isEdit && <FiEdit onClick={() => setDueDateEdit(true)} size={18} className='absolute top-3 right-4 cursor-pointer' />}
                                <p className='font-semibold text-xl'>Due Date</p>
                                <p className='font-semibold text-xl'>{log_due_date && format(new Date(log_due_date), "dd/MM/y")}</p>
                            </div>
                            <div className={!isEdit ? 'relative text-center border-2 border-[#00000066] rounded-xl p-2' : 'text-center'}>
                                {!isEdit && <FiEdit onClick={() => setPersonSearchEdit(true)} size={18} className='absolute top-3 right-4 cursor-pointer' />}
                                <p className='font-semibold text-xl'>Assigned - {assigned && assigned[0].name}</p>
                                <div className="flex -space-x-4 justify-center items-center">
                                    <img className="w-8 h-8 border-2 border-white rounded-full " src={assigned && `http://localhost:5000/images/${assigned[0].image}`} alt="" />
                                </div>
                            </div>
                            <div className={!isEdit ? 'relative text-center border-2 border-[#00000066] rounded-xl p-2' : 'text-center'}>
                                {/* {!isEdit && <FiEdit onClick={() => setTypeEdit(true)} size={18} className='absolute top-3 right-4 cursor-pointer' />} */}
                                <p className='font-semibold text-2xl'>Type</p>
                                <p className='font-semibold text-[#FF1515] text-xl'>{log_type}</p>
                            </div>
                            <div className={!isEdit ? 'relative border-2 border-[#00000066] text-center p-2 rounded-xl' : 'text-center '}>
                                {!isEdit && <FiEdit onClick={setTagEdit} size={18} className='absolute top-3 right-4 cursor-pointer' />}
                                <p className='font-semibold text-2xl '>Tags</p>
                                <p className='font-semibold text-xl '>{log_tags?.length ? log_tags.slice(0, 3).join(', ') : "Null"}{log_tags?.length ? <button onClick={() => setTagModal(!tagModal)}>...</button> : ""}</p>
                            </div>

                        </div>
                        <div>
                            <h1 className='mb-3 text-3xl'>{log_type} Description</h1>
                            {
                                log_type === "Risk" && log_description?.risk_description.map(desc => <div key={desc.id} className="relative w-full">
                                    {!isEdit && <FiEdit onClick={() => {
                                        setDescriptonEdit(true)
                                        setCurrentEditDesc(desc)
                                    }} size={18} className='absolute top-3 right-4 cursor-pointer' />}
                                    <input type="text" className={!isEdit ? 'block my-4 w-full text-xl border-2 border-[#00000066] rounded-xl px-4 py-1 focus:outline-none cursor-default' : 'block my-1 border-2 border-[#00000000] py-1 w-full text-xl focus:outline-none'} value={`${format(new Date(desc?.date), "dd-MM-y")} - ${desc.content}`} readOnly={true} />
                                </div>).reverse()
                            }

                            {
                                log_type === "Action" && log_description?.action_description.map(desc => <div key={desc.id} className='relative w-full'>
                                    {!isEdit && <FiEdit onClick={() => {
                                        setDescriptonEdit(true)
                                        setCurrentEditDesc(desc)
                                    }} size={18} className='absolute top-3 right-4 cursor-pointer' />}
                                    <input type="text" className={!isEdit ? 'block my-4 w-full text-xl border-2 border-[#00000066] rounded-xl px-4 py-1 focus:outline-none cursor-default' : 'block my-1 border-2 border-[#00000000] py-1 w-full text-xl focus:outline-none'} value={`${format(new Date(desc?.date), "dd-MM-y")} - ${desc.content}`} readOnly={true} />
                                </div>).reverse()
                            }
                        </div>
                        <div className='mt-12'>
                            <h1 className='mb-3 text-3xl'>Control Description</h1>
                            {
                                log_description?.control_description.map(desc => <div key={desc.id} className='relative w-full'>
                                    {!isEdit && <FiEdit onClick={() => {
                                        setControlTaskType(true)
                                        setDescriptonEdit(true)
                                        setCurrentEditDesc(desc)
                                    }} size={18} className='absolute top-3 right-4 cursor-pointer' />}
                                    <input type="text" className={!isEdit ? 'block my-4 w-full text-xl border-2 border-[#00000066] rounded-xl px-4 py-1 focus:outline-none cursor-default' : 'block my-1 border-2 border-[#00000000] py-1 w-full text-xl focus:outline-none'} value={`${format(new Date(desc?.date), "dd-MM-y")} - ${desc.content}`} readOnly={true} />
                                </div>).reverse()
                            }

                        </div>
                        {!isEdit && <div className='flex justify-end'>
                            <button onClick={() => setIsEdit(!isEdit)} className='mr-8 mt-10 bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold'>Cancel</button>
                        </div>}
                    </>
                }
            </div>

            {tagModal && <div onClick={() => setTagModal(!tagModal)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                    <div onClick={() => setTagModal(!tagModal)} className='absolute right-10 top-8'><GrClose className='text-xl cursor-pointer overflow-hidden	' /></div>
                    <p className='py-1 text-[35px] font-medium'>Tags</p>
                    <p className='py-1 text-[18px]'>{log_tags?.join(', ')}</p>

                </div>
            </div>}
            {task && <div onClick={() => setTask(!task)} className=' absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                    <div onClick={() => setTask(!task)} className='absolute right-10 top-8'><GrClose className='text-xl cursor-pointer overflow-hidden	' /></div>
                    <p className='py-1 text-[20px] font-medium my-8 '>Do you want to complete the task?</p>
                    <div>
                        <button onClick={handleLogStatus} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold mx-4'>Yes</button>
                        <button onClick={() => setTask(!task)} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold mx-4'>No</button>
                    </div>
                </div>
            </div>}
            {/* tag edit modal */}
            {tagEdit && <div onClick={() => setTagEdit(false)} className=' absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                    <div onClick={() => setTagEdit(false)} className='absolute right-10 top-8'><GrClose className='text-xl cursor-pointer overflow-hidden	' /></div>
                    <p className='py-1 text-[35px] font-medium'>Tags</p>
                    {/* <p className='py-1 text-[18px]'>Fence, steel, lawn , Home, House , state</p> */}
                    <textarea onChange={(e) => setUpdatedLogTags(e.target.value)} className='border-2 border-[#00000066] focus:outline-none p-4' defaultValue={`${log_tags ? log_tags?.join(', ') : ''}`} name="" id="" cols="40" rows="5"></textarea>
                    <button onClick={handleUpdateLogTags} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold mx-4 mt-10'>Update</button>
                </div>
            </div>}
            {/* tag edit modal ends */}

            {/* type edit modal */}
            {typeEdit && <div onClick={() => setTypeEdit(false)} className=' absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                    <div onClick={() => setTypeEdit(false)} className='absolute right-10 top-8'><GrClose className='text-xl cursor-pointer overflow-hidden	' /></div>

                    <select onChange={(e) => setUpdatedLogType(e.target.value)} className='border-2 border-[#00000066] p-3 w-56 focus:outline-none ' name="" id="">
                        <option value="">Select Type</option>
                        <option value="Risk">Risk</option>
                        <option value="Action">Action</option>
                    </select>


                    <button onClick={handleUpdateLogType} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold mx-4 mt-12'>Update</button>
                </div>
            </div>}
            {/* type edit modal ends */}

            {/* dueDateEdit edit modal */}
            {dueDateEdit && <div onClick={() => setDueDateEdit(false)} className=' absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                    <div onClick={() => setDueDateEdit(false)} className='absolute right-10 top-8'><GrClose className='text-xl cursor-pointer overflow-hidden	' /></div>

                    <input onChange={(e) => setUpdatedLogDueDate(e.target.value)} defaultValue={formattedToday} className=' border-2 border-[#00000066] p-2 focus:outline-none' type="date" name="" id="" />


                    <button onClick={handleUpdateDueDate} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold mx-4 mt-12'>Update</button>
                </div>
            </div>}
            {/* tdueDateEdit edit modal ends */}

            {/* setAssing edit modal */}
            {assing && <div onClick={() => setAssing(false)} className=' absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                    <div onClick={() => setAssing(false)} className='absolute right-10 top-8'><GrClose className='text-xl cursor-pointer overflow-hidden	' /></div>

                    <input defaultValue={formattedToday} className=' border-2 border-[#00000066] p-2' type="date" name="" id="" />


                    <button onClick={handleAssingUpdate} className='bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold mx-4 mt-12'>Update</button>
                </div>
            </div>}
            {/* setAssing edit modal ends */}

            {/* description edit modal */}
            {descriptionEdit && <div onClick={() => {
                setDescriptonEdit(false)
                setControlTaskType(false)
            }} className=' absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative px-10 custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                    <div onClick={() => {
                        setDescriptonEdit(false)
                        setControlTaskType(false)
                    }} className='absolute right-10 top-8'><GrClose className='text-xl cursor-pointer overflow-hidden	' /></div>

                    <div className='my-5'>
                        <h1 className='mb-3 text-3xl'>{log_type} Description</h1>
                        <textarea onChange={(e) => setUpdatedDescContent(e.target.value)} className='w-full p-2 text-xl border border-[#ddd] focus:outline-none' name="" id="" cols="50" rows="1" defaultValue={`${currentEditDesc.content}`}></textarea>
                    </div>
                    <div><button onClick={handleUpdateDescription} className='block ml-auto bg-[#30FFE4] py-3 px-14 rounded-2xl font-semibold'>Update</button></div>
                </div>
            </div>}

            {/* search person modal */}
            {
                personSearchEdit && <div onClick={() => setPersonSearchEdit(false)} className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

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
                                assignedData?.map((person, index) => <div key={index} onClick={() => handleAssignData(person)} className='flex gap-2 items-center cursor-pointer'>
                                    <img className="w-8 h-8 rounded-full " src={`http://localhost:5000/images/${person.assigned[0].image}`} alt="" />
                                    <p>{person.assigned[0].name}</p>
                                </div>)
                            }
                        </div>
                    </div>
                </div>
            }
        </section>
    );
};

export default LogDetails; 