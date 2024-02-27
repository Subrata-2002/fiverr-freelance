import React from 'react'
import "./ProjectCard.scss"
import { Link } from 'react-router-dom'


const ProjectCard = ({ item }) => {
    return (
        <div>
            <Link to="/gigs?Project=design" className='link'>
                <div className='projectCard'>

                    <img src={item.img} alt="" />
                    <div className="info">
                        <img src={item.pp} alt="" />
                        <div className="texts">
                            <h2>{item.cat}</h2>
                            <span>by {item.username}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProjectCard
