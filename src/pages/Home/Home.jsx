import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { GrClose } from 'react-icons/gr';
import { useEffect, useState } from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import { IoSettingsSharp } from 'react-icons/io5';
import SingleProject from './SingleProject';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
    const [showProjectDetails, setShowProjectDetails] = useState(false)
    const [showAddProject, setSowAddProject] = useState(false)
    const [allProjects, setAllProjects] = useState([])
    const [refetch, setRefetch] = useState(false)
    const [singleProject, setSingleProject] = useState({})
    const location = useLocation()

    const [projectName, setProjectName] = useState('')
    const [client, setClient] = useState('')
    const [code, setCode] = useState('')
    const [notes, setNotes] = useState('')

    // pagination related works
    const [currentPage, setCurrentPage] = useState(1)
    const { totalProjects } = useLoaderData()
    const pages = Math.ceil(totalProjects / 8)
    const pagesNumber = [...Array(pages).keys()]

    useEffect(() => {
        fetch(`http://localhost:5000/all-projects?page=${currentPage}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setAllProjects(data)
            })
            .catch(error => console.log(error))
    }, [refetch, currentPage])

    const handleAddProject = () => {
        const projectId = uuidv4();
        const project = { _id: projectId, project_name: projectName, client_name: client, project_code: code, project_notes: notes, project_logs: [] };

        fetch('http://localhost:5000/add-project', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(project)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setRefetch(!refetch)
                setSowAddProject(!showAddProject)
                console.log("Successfully created new Project")
            })
            .catch(error => console.log(error))
    }

    const handleProjectDetails = (id) => {
        setShowProjectDetails(true)
        const selectedProject = allProjects?.find(project => project._id === id)
        setSingleProject(selectedProject)
    }

    return (
        <section>
            <div className='max-w-7xl mx-auto relative w-full h-screen p-12'>
                <Link to="/setting" state={{ from: location }} className='flex justify-center items-center w-12 h-12  custom-shadow absolute top-10 rounded-full right-12 cursor-pointer'>
                    <IoSettingsSharp size={24} />
                </Link>
                <div>
                    <h1 className='text-4xl font-bold text-center text-black'>Projects</h1>
                </div>
                <button onClick={() => setSowAddProject(!showAddProject)} className='mt-8 custom-shadow ml-auto  block text-xl font-medium py-3 px-10 rounded-2xl bg-[#30FFE4]'>Add Project</button>
                <div className='w-full grid grid-cols-4 mt-20 gap-[50px]'>
                    {
                        allProjects?.map((project, index) => <SingleProject key={index} project={project} handleProjectDetails={handleProjectDetails} />).reverse()
                    }
                </div>

                {/* pagination */}
                {
                    totalProjects > 8 && <div className='w-fit absolute left-1/2 right-1/2 transform translate-x-[-50%] -translate-y-[-50%] bottom-20 mx-auto rounded-full custom-shadow flex items-center gap-5 font-semibold text-xl'>
                        <span className='px-5 h-12 rounded-full border cursor-pointer border[#ADADAD] flex items-center justify-center'><FaAnglesLeft size={24} /></span>
                        {
                            pagesNumber.map(page => <button onClick={() => setCurrentPage(page + 1)} key={page} className={currentPage === page + 1 ? 'text-black text-opacity-100' : 'text-black text-opacity-20'}> {page + 1} </button>)
                        }
                        <span className='px-5 h-12 rounded-full border cursor-pointer border[#ADADAD] flex items-center justify-center'><FaAnglesRight size={24} /></span>
                    </div>
                }

            </div>
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

                        <button onClick={handleAddProject} className='mt-8 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Create</button>
                    </div>
                </div>
            }
        </section>

    );
}

export default Home; 