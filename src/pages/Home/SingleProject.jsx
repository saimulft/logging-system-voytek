import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiNews } from 'react-icons/bi';
import { FaRegEye } from 'react-icons/fa6';
import { FaRegTrashCan } from 'react-icons/fa6';


const SingleProject = ({ project, handleProjectDetails, setProjectid, setIsDeleteModal }) => {
    const { _id, project_name, client_name, project_code } = project || {}




    const handleDelete = (id) => {

        setProjectid(id)
        setIsDeleteModal(true)
    }

    return (
        <div className=' bg-white custom-shadow rounded-2xl relative '>
            <div className='absolute top-3 right-4 flex items-center gap-4'>
                <button onClick={() => handleDelete(_id)} className='cursor-pointer'> <FaRegTrashCan size={20} /> </button>
                <button onClick={() => handleProjectDetails(_id)} className='cursor-pointer'> <FaRegEye size={24} /> </button>

            </div>
            <Link to={`/project/logs/${_id}`}>
                <div className='flex justify-center items-center flex-col p-8'>
                    <BiNews className='text-4xl' />
                    <p title={project_name} className='text-[#444] font-bold text-xl'>{project_name?.length > 13 ? `${project_name.slice(0, 13)}..` : project_name}</p>
                    <p className=' font-semibold  text-[19px]  py-1'>{client_name}</p>
                    <p className='font-semibold	text-[19px]'>{project_code}</p>
                </div>
            </Link>
        </div>
    );
};

export default SingleProject;