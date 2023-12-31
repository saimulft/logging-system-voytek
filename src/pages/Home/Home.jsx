import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { GrClose } from 'react-icons/gr';
import { useEffect, useState } from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import { IoSettingsSharp } from 'react-icons/io5';
import SingleProject from './SingleProject';
import { v4 as uuidv4 } from 'uuid';
import ClipLoader from "react-spinners/ClipLoader";

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [showProjectDetails, setShowProjectDetails] = useState(false)
    const [showAddProject, setSowAddProject] = useState(false)
    const [allProjects, setAllProjects] = useState([])
    const [refetch, setRefetch] = useState(false)
    const [singleProject, setSingleProject] = useState({})
    const location = useLocation()

    const [isDeleteProject, setIsDeleteProject] = useState(false)
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [projecId, setProjectid] = useState('')


    const [projectName, setProjectName] = useState('')
    const [client, setClient] = useState('')
    const [code, setCode] = useState('')
    const [notes, setNotes] = useState('')

    // pagination related works
    const [currentPage, setCurrentPage] = useState(1)
    const [totalProjects, setTotalProjects] = useState(0)
    const pages = Math.ceil(totalProjects / 8)
    const pagesNumber = totalProjects && [...Array(pages).keys()]

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/total-projects`)
            .then(res => res.json())
            .then(data => {
                setTotalProjects(data.totalProjects)
            })
    }, [refetch])

    useEffect(() => {
        setLoading(true)
        setAllProjects([])
        fetch(`${import.meta.env.VITE_BASE_URL}/all-projects?page=${currentPage}`)
            .then(res => res.json())
            .then(data => {
                setAllProjects(data)
                setLoading(false)
            })
            .catch(error => console.log(error))
    }, [refetch, currentPage])

    const handleAddProject = () => {
        setLoading(true)
        const projectId = uuidv4();
        const project = { _id: projectId, project_name: projectName, client_name: client, project_code: code, project_notes: notes, project_logs: [] };

        fetch(`${import.meta.env.VITE_BASE_URL}/add-project`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(project)
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                setRefetch(!refetch)
                setSowAddProject(!showAddProject)
            })
            .catch(error => console.log(error))
    }

    const handleProjectDetails = (id) => {
        setShowProjectDetails(true)
        const selectedProject = allProjects?.find(project => project._id === id)
        setSingleProject(selectedProject)
    }
    const handleDeleteProject = () => {
        fetch(`${import.meta.env.VITE_BASE_URL}/delete-project`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ projecId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount) {
                    setRefetch(!refetch)
                    setIsDeleteModal(false)

                }

            })

    }

    return (
        <section>
            <div className='max-w-[1400px] mx-auto relative w-full h-screen p-12'>
                <Link to="/setting" state={{ from: location }} className='flex justify-center items-center w-12 h-12  custom-shadow absolute top-10 rounded-full right-12 cursor-pointer'>
                    <IoSettingsSharp size={24} />
                </Link>
                <div>
                    <h1 className='text-4xl font-bold text-center text-black'>Projects</h1>
                </div>
                <button onClick={() => setSowAddProject(!showAddProject)} className='mt-8 custom-shadow ml-auto  block text-xl font-medium py-3 px-10 rounded-2xl bg-[#30FFE4]'>Add Project</button>
                <div className='w-full grid grid-cols-4 mt-20 gap-[50px]'>
                    {
                        allProjects?.map((project, index) => <SingleProject setIsDeleteModal={setIsDeleteModal} setProjectid={setProjectid} key={index} project={project} handleProjectDetails={handleProjectDetails} />)
                    }
                </div>
                {/* loader / spinner */}
                <div className='flex justify-center mt-40'>
                    <ClipLoader color="#000000" loading={loading} size={50} />
                </div>

                {/* pagination */}
                {
                    totalProjects > 8 && !loading && <div className='w-fit absolute left-1/2 right-1/2 transform translate-x-[-50%] -translate-y-[-50%] bottom-20 mx-auto rounded-full custom-shadow flex items-center gap-5 font-semibold text-xl'>
                        <span onClick={() => {
                            if (currentPage > 1) {
                                setCurrentPage(currentPage - 1)
                            }
                        }} className='px-5 h-12 rounded-full border cursor-pointer border[#ADADAD] flex items-center justify-center'><FaAnglesLeft size={24} /></span>
                        {
                            pagesNumber.map(page => <button onClick={() => setCurrentPage(page + 1)} key={page} className={currentPage === page + 1 ? 'text-black text-opacity-100' : 'text-black text-opacity-20'}> {page + 1} </button>)
                        }
                        <span onClick={() => {

                            if (pages > currentPage) {
                                setCurrentPage(currentPage + 1)
                            }
                        }} className='px-5 h-12 rounded-full border cursor-pointer border[#ADADAD] flex items-center justify-center'><FaAnglesRight size={24} /></span>
                    </div>
                }

            </div>
            {isDeleteModal &&
                <div onClick={() => setIsDeleteProject(!isDeleteProject)} className=' absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                    <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] px-10 bg-[#fff] flex justify-center items-center flex-col'>

                        <p className='py-1 text-[25px] font-medium'>Are you sure ?</p>
                        <div>
                            <button onClick={() => setIsDeleteModal(false)} className='mt-8 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold mx-4'>No</button>
                            <button onClick={handleDeleteProject} className='mt-8 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold mx-4'>Yes</button>
                        </div>
                    </div>
                </div>
            }
            {showProjectDetails &&
                <div onClick={() => setShowProjectDetails(!showProjectDetails)} className=' absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                    <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] px-10 bg-[#fff] flex justify-center items-center flex-col'>
                        <div onClick={() => setShowProjectDetails(!showProjectDetails)} className='absolute right-10 top-8'><GrClose className='text-xl cursor-pointer overflow-hidden	' /></div>
                        <p className='py-1 text-[35px] font-medium'>Tags</p>
                        <p className='py-1 text-[25px]'>{singleProject.project_name}</p>
                        <p className='py-1 text-[25px]'>{singleProject.client_name}</p>
                        <p className='py-1 text-[25px]'>{singleProject.project_code}</p>
                        <p className='py-1 text-[25px]'>{singleProject.project_notes}</p>
                    </div>
                </div>
            }
            {showAddProject &&
                <div onClick={() => setSowAddProject(!showAddProject)} className=' absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>

                    <div onClick={(e) => e.stopPropagation()} data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff] flex justify-center items-center flex-col'>
                        <div onClick={() => setSowAddProject(!showAddProject)} className='absolute right-10 top-8'><GrClose className='text-xl cursor-pointer overflow-hidden	' /></div>
                        <input onChange={(e) => setProjectName(e.target.value)} className='focus:outline-none w-3/5 my-3 p-2 border border-[#ddd]' placeholder='Project Name' type="text" name='projectName' />
                        <input onChange={(e) => setClient(e.target.value)} className='focus:outline-none w-3/5 my-3 p-2 border border-[#ddd]' placeholder='Client' type="text" name='client' />
                        <input onChange={(e) => setCode(e.target.value)} className='focus:outline-none w-3/5 my-3 p-2 border border-[#ddd]' placeholder='Code' type="text" name='code' />
                        <input onChange={(e) => setNotes(e.target.value)} className='focus:outline-none w-3/5 my-3 p-2 border border-[#ddd]' placeholder='Notes' type="text" name='notes' />

                        <button onClick={handleAddProject} disabled={!notes || !code || !client || !projectName} className='mt-8 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Create</button>
                    </div>
                </div>
            }
        </section>

    );
}

export default Home; 